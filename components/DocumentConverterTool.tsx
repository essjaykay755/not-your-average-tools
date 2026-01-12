"use client";

import React, { useState, useCallback, useRef } from 'react';

type FileFormat = 'json' | 'csv' | 'xml' | 'md' | 'txt' | 'html' | 'yaml';

interface ConversionResult {
    content: string;
    format: FileFormat;
    filename: string;
}

interface UploadedFile {
    name: string;
    size: number;
    content: string;
}

const FORMAT_OPTIONS: { value: FileFormat; label: string; ext: string }[] = [
    { value: 'json', label: 'JSON', ext: '.json' },
    { value: 'csv', label: 'CSV', ext: '.csv' },
    { value: 'xml', label: 'XML', ext: '.xml' },
    { value: 'md', label: 'Markdown', ext: '.md' },
    { value: 'txt', label: 'Plain Text', ext: '.txt' },
    { value: 'html', label: 'HTML', ext: '.html' },
    { value: 'yaml', label: 'YAML', ext: '.yaml' },
];

// Conversion utilities
const jsonToCsv = (json: unknown): string => {
    if (!Array.isArray(json)) {
        json = [json];
    }
    const arr = json as Record<string, unknown>[];
    if (arr.length === 0) return '';

    const headers = Object.keys(arr[0]);
    const csvRows = [headers.join(',')];

    for (const row of arr) {
        const values = headers.map(h => {
            const val = row[h];
            const str = val === null || val === undefined ? '' : String(val);
            return `"${str.replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};

const csvToJson = (csv: string): unknown[] => {
    const lines = csv.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = parseCsvLine(lines[0]);
    const result: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const obj: Record<string, string> = {};
        headers.forEach((h, idx) => {
            obj[h] = values[idx] || '';
        });
        result.push(obj);
    }
    return result;
};

const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
};

const jsonToXml = (json: unknown, rootName = 'root'): string => {
    const convert = (obj: unknown, name: string): string => {
        if (obj === null || obj === undefined) return `<${name}/>`;
        if (typeof obj !== 'object') return `<${name}>${escapeXml(String(obj))}</${name}>`;

        if (Array.isArray(obj)) {
            return obj.map(item => convert(item, 'item')).join('\n');
        }

        const entries = Object.entries(obj as Record<string, unknown>);
        const inner = entries.map(([k, v]) => convert(v, k)).join('\n');
        return `<${name}>\n${inner}\n</${name}>`;
    };

    return `<?xml version="1.0" encoding="UTF-8"?>\n${convert(json, rootName)}`;
};

const escapeXml = (str: string): string => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const xmlToJson = (xml: string): unknown => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');

    const parseNode = (node: Element): unknown => {
        const children = Array.from(node.children);
        if (children.length === 0) {
            return node.textContent?.trim() || '';
        }

        const result: Record<string, unknown> = {};
        const arrays: Record<string, unknown[]> = {};

        children.forEach(child => {
            const name = child.nodeName;
            const value = parseNode(child);

            if (result[name] !== undefined) {
                if (!arrays[name]) {
                    arrays[name] = [result[name]];
                }
                arrays[name].push(value);
                result[name] = arrays[name];
            } else {
                result[name] = value;
            }
        });

        return result;
    };

    return parseNode(doc.documentElement);
};

const jsonToYaml = (json: unknown, indent = 0): string => {
    const spaces = '  '.repeat(indent);

    if (json === null) return 'null';
    if (typeof json === 'boolean') return json ? 'true' : 'false';
    if (typeof json === 'number') return String(json);
    if (typeof json === 'string') {
        if (json.includes('\n') || json.includes(':') || json.includes('#')) {
            return `"${json.replace(/"/g, '\\"')}"`;
        }
        return json;
    }

    if (Array.isArray(json)) {
        if (json.length === 0) return '[]';
        return json.map(item => `${spaces}- ${jsonToYaml(item, indent + 1).trimStart()}`).join('\n');
    }

    if (typeof json === 'object') {
        const entries = Object.entries(json as Record<string, unknown>);
        if (entries.length === 0) return '{}';
        return entries.map(([k, v]) => {
            const val = jsonToYaml(v, indent + 1);
            if (typeof v === 'object' && v !== null && (Array.isArray(v) ? v.length > 0 : Object.keys(v).length > 0)) {
                return `${spaces}${k}:\n${val}`;
            }
            return `${spaces}${k}: ${val}`;
        }).join('\n');
    }

    return String(json);
};

const yamlToJson = (yaml: string): unknown => {
    const lines = yaml.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));

    const parseValue = (val: string): unknown => {
        val = val.trim();
        if (val === 'null' || val === '~') return null;
        if (val === 'true') return true;
        if (val === 'false') return false;
        if (/^-?\d+$/.test(val)) return parseInt(val);
        if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            return val.slice(1, -1);
        }
        return val;
    };

    try {
        const result: Record<string, unknown> = {};

        for (const line of lines) {
            const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
            if (match) {
                const [, , key, value] = match;
                if (value) {
                    result[key.trim()] = parseValue(value);
                } else {
                    result[key.trim()] = {};
                }
            }
        }

        return result;
    } catch {
        throw new Error('Invalid YAML format');
    }
};

const jsonToMarkdown = (json: unknown): string => {
    if (Array.isArray(json) && json.length > 0 && typeof json[0] === 'object') {
        const headers = Object.keys(json[0] as Record<string, unknown>);
        const headerRow = `| ${headers.join(' | ')} |`;
        const divider = `| ${headers.map(() => '---').join(' | ')} |`;
        const rows = json.map(item => {
            const obj = item as Record<string, unknown>;
            return `| ${headers.map(h => String(obj[h] ?? '')).join(' | ')} |`;
        });
        return [headerRow, divider, ...rows].join('\n');
    }

    const convert = (obj: unknown, depth = 0): string => {
        if (typeof obj !== 'object' || obj === null) {
            return String(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map(item => `- ${convert(item, depth)}`).join('\n');
        }

        const heading = '#'.repeat(Math.min(depth + 1, 6));
        return Object.entries(obj as Record<string, unknown>)
            .map(([k, v]) => {
                if (typeof v === 'object' && v !== null) {
                    return `${heading} ${k}\n\n${convert(v, depth + 1)}`;
                }
                return `**${k}**: ${v}`;
            })
            .join('\n\n');
    };

    return convert(json);
};

const jsonToHtml = (json: unknown): string => {
    const convert = (obj: unknown): string => {
        if (typeof obj !== 'object' || obj === null) {
            return `<span>${escapeXml(String(obj))}</span>`;
        }

        if (Array.isArray(obj)) {
            if (obj.length > 0 && typeof obj[0] === 'object') {
                const headers = Object.keys(obj[0] as Record<string, unknown>);
                return `<table border="1" cellpadding="8" cellspacing="0">
<thead><tr>${headers.map(h => `<th>${escapeXml(h)}</th>`).join('')}</tr></thead>
<tbody>${obj.map(item => {
                    const row = item as Record<string, unknown>;
                    return `<tr>${headers.map(h => `<td>${escapeXml(String(row[h] ?? ''))}</td>`).join('')}</tr>`;
                }).join('')}</tbody>
</table>`;
            }
            return `<ul>${obj.map(item => `<li>${convert(item)}</li>`).join('')}</ul>`;
        }

        return `<dl>${Object.entries(obj as Record<string, unknown>)
            .map(([k, v]) => `<dt><strong>${escapeXml(k)}</strong></dt><dd>${convert(v)}</dd>`)
            .join('')}</dl>`;
    };

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Converted Document</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:800px;margin:0 auto}table{border-collapse:collapse;width:100%}th{background:#f3f4f6}th,td{text-align:left}</style>
</head>
<body>${convert(json)}</body>
</html>`;
};

const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const DocumentConverterTool: React.FC = () => {
    const [inputFormat, setInputFormat] = useState<FileFormat>('json');
    const [outputFormat, setOutputFormat] = useState<FileFormat>('csv');
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target?.result as string;
            setUploadedFile({
                name: file.name,
                size: file.size,
                content
            });

            // Auto-detect format from extension
            const ext = file.name.split('.').pop()?.toLowerCase();
            const format = FORMAT_OPTIONS.find(f => f.ext === `.${ext}`)?.value;
            if (format) setInputFormat(format);

            // Reset previous results
            setResult(null);
            setError(null);
        };
        reader.readAsText(file);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileUpload(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    const convert = useCallback(() => {
        if (!uploadedFile) {
            setError('Please upload a file first');
            return;
        }

        setError(null);
        setResult(null);
        setIsConverting(true);

        // Simulate async for UI feedback
        setTimeout(() => {
            try {
                let intermediate: unknown;

                // Step 1: Parse input to intermediate format
                switch (inputFormat) {
                    case 'json':
                        intermediate = JSON.parse(uploadedFile.content);
                        break;
                    case 'csv':
                        intermediate = csvToJson(uploadedFile.content);
                        break;
                    case 'xml':
                        intermediate = xmlToJson(uploadedFile.content);
                        break;
                    case 'yaml':
                        intermediate = yamlToJson(uploadedFile.content);
                        break;
                    case 'md':
                    case 'txt':
                    case 'html':
                        intermediate = { content: uploadedFile.content };
                        break;
                    default:
                        throw new Error(`Unsupported input format: ${inputFormat}`);
                }

                // Step 2: Convert intermediate to output format
                let outputContent: string;

                switch (outputFormat) {
                    case 'json':
                        outputContent = JSON.stringify(intermediate, null, 2);
                        break;
                    case 'csv':
                        outputContent = jsonToCsv(intermediate);
                        break;
                    case 'xml':
                        outputContent = jsonToXml(intermediate, 'data');
                        break;
                    case 'yaml':
                        outputContent = jsonToYaml(intermediate);
                        break;
                    case 'md':
                        outputContent = jsonToMarkdown(intermediate);
                        break;
                    case 'html':
                        outputContent = jsonToHtml(intermediate);
                        break;
                    case 'txt':
                        outputContent = typeof intermediate === 'string'
                            ? intermediate
                            : JSON.stringify(intermediate, null, 2);
                        break;
                    default:
                        throw new Error(`Unsupported output format: ${outputFormat}`);
                }

                const baseName = uploadedFile.name.replace(/\.[^.]+$/, '');
                setResult({
                    content: outputContent,
                    format: outputFormat,
                    filename: `${baseName}${FORMAT_OPTIONS.find(f => f.value === outputFormat)?.ext}`
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Conversion failed');
            } finally {
                setIsConverting(false);
            }
        }, 300);
    }, [uploadedFile, inputFormat, outputFormat]);

    const downloadResult = () => {
        if (result) {
            const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const clearFile = () => {
        setUploadedFile(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 md:p-8 gap-6">
            {/* Format Selection */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    {/* Input Format */}
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            From Format
                        </label>
                        <select
                            value={inputFormat}
                            onChange={(e) => { setInputFormat(e.target.value as FileFormat); setResult(null); }}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {FORMAT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 shrink-0">
                        <span className="material-symbols-outlined text-2xl text-gray-400">arrow_forward</span>
                    </div>

                    {/* Output Format */}
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            To Format
                        </label>
                        <select
                            value={outputFormat}
                            onChange={(e) => { setOutputFormat(e.target.value as FileFormat); setResult(null); }}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            {FORMAT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div
                className={`relative bg-white dark:bg-surface-dark rounded-2xl border-2 border-dashed transition-all ${dragActive
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : uploadedFile
                            ? 'border-green-500 dark:border-green-500'
                            : 'border-gray-300 dark:border-white/20 hover:border-primary/50'
                    } p-8 shadow-sm`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleInputChange}
                    className="hidden"
                    accept=".json,.csv,.xml,.md,.txt,.html,.yaml,.yml"
                />

                {uploadedFile ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">description</span>
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-text-main dark:text-white truncate">{uploadedFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(uploadedFile.size)} • {inputFormat.toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex flex-col items-center justify-center cursor-pointer py-8"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl text-primary">upload_file</span>
                        </div>
                        <p className="text-lg font-semibold text-text-main dark:text-white mb-1">
                            Drop your file here
                        </p>
                        <p className="text-sm text-gray-500">
                            or <span className="text-primary font-medium">click to browse</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-3">
                            Supports: JSON, CSV, XML, Markdown, HTML, YAML, TXT
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={convert}
                    disabled={!uploadedFile || isConverting}
                    className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                    {isConverting ? (
                        <>
                            <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                            Converting...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[20px]">sync_alt</span>
                            Convert File
                        </>
                    )}
                </button>

                <button
                    onClick={downloadResult}
                    disabled={!result}
                    className={`w-full sm:w-auto px-8 py-4 font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${result
                            ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                            : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    {result ? `Download ${result.format.toUpperCase()}` : 'Download'}
                </button>
            </div>

            {/* Success Message */}
            {result && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-500 shrink-0">check_circle</span>
                    <div>
                        <p className="font-semibold text-green-700 dark:text-green-300">Conversion Complete!</p>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Your file has been converted to {FORMAT_OPTIONS.find(f => f.value === outputFormat)?.label}.
                            Click the download button to save <span className="font-mono">{result.filename}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Info Footer */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <p className="text-xs text-gray-500 text-center">
                    <span className="font-semibold">Supported formats:</span>{' '}
                    {FORMAT_OPTIONS.map(f => f.label).join(' • ')}
                    {' • '}
                    <span className="text-gray-400">All conversions happen locally in your browser</span>
                </p>
            </div>
        </div>
    );
};
