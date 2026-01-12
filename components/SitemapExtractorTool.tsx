"use client";

import React, { useState } from 'react';

interface ExtractedUrl {
    loc: string;
    lastmod?: string;
    changefreq?: string;
    priority?: string;
}

export const SitemapExtractorTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [inputType, setInputType] = useState<'url' | 'xml'>('xml');
    const [urls, setUrls] = useState<ExtractedUrl[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [filter, setFilter] = useState('');
    const [exportFormat, setExportFormat] = useState<'plain' | 'csv' | 'json'>('plain');

    const parseXml = (xml: string): ExtractedUrl[] => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');

        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            throw new Error('Invalid XML format');
        }

        const extractedUrls: ExtractedUrl[] = [];

        // Handle regular sitemaps
        const urlElements = doc.querySelectorAll('url');
        urlElements.forEach((urlEl) => {
            const loc = urlEl.querySelector('loc')?.textContent?.trim();
            if (loc) {
                extractedUrls.push({
                    loc,
                    lastmod: urlEl.querySelector('lastmod')?.textContent?.trim(),
                    changefreq: urlEl.querySelector('changefreq')?.textContent?.trim(),
                    priority: urlEl.querySelector('priority')?.textContent?.trim(),
                });
            }
        });

        // Handle sitemap index files
        const sitemapElements = doc.querySelectorAll('sitemap');
        sitemapElements.forEach((sitemapEl) => {
            const loc = sitemapEl.querySelector('loc')?.textContent?.trim();
            if (loc) {
                extractedUrls.push({
                    loc,
                    lastmod: sitemapEl.querySelector('lastmod')?.textContent?.trim(),
                });
            }
        });

        return extractedUrls;
    };

    const handleExtract = async () => {
        setError(null);
        setUrls([]);

        if (!input.trim()) {
            setError('Please enter sitemap XML or URL');
            return;
        }

        setLoading(true);

        try {
            let xmlContent = input;

            if (inputType === 'url') {
                try {
                    const response = await fetch(input.trim());
                    if (!response.ok) {
                        throw new Error(`Failed to fetch: ${response.status}`);
                    }
                    xmlContent = await response.text();
                } catch (err) {
                    throw new Error('Could not fetch sitemap. CORS restrictions may apply.');
                }
            }

            const extractedUrls = parseXml(xmlContent);

            if (extractedUrls.length === 0) {
                throw new Error('No URLs found in the sitemap');
            }

            setUrls(extractedUrls);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to extract URLs');
        } finally {
            setLoading(false);
        }
    };

    const filteredUrls = urls.filter(u =>
        u.loc.toLowerCase().includes(filter.toLowerCase())
    );

    const getExportContent = (): string => {
        const data = filteredUrls;

        switch (exportFormat) {
            case 'csv':
                const headers = 'URL,Last Modified,Change Frequency,Priority';
                const rows = data.map(u =>
                    `"${u.loc}","${u.lastmod || ''}","${u.changefreq || ''}","${u.priority || ''}"`
                );
                return [headers, ...rows].join('\n');

            case 'json':
                return JSON.stringify(data, null, 2);

            case 'plain':
            default:
                return data.map(u => u.loc).join('\n');
        }
    };

    const copyUrls = () => {
        navigator.clipboard.writeText(getExportContent());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadUrls = () => {
        const content = getExportContent();
        const ext = exportFormat === 'json' ? 'json' : exportFormat === 'csv' ? 'csv' : 'txt';
        const type = exportFormat === 'json' ? 'application/json' : 'text/plain';

        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sitemap-urls.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-5xl mx-auto p-4 md:p-8 gap-6">
            {/* Input Section */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Sitemap Input
                    </span>
                    <div className="flex bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg p-1">
                        <button
                            onClick={() => setInputType('xml')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${inputType === 'xml'
                                ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:text-text-main dark:text-gray-400'
                                }`}
                        >
                            Paste XML
                        </button>
                        <button
                            onClick={() => setInputType('url')}
                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${inputType === 'url'
                                ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                                : 'text-gray-500 hover:text-text-main dark:text-gray-400'
                                }`}
                        >
                            From URL
                        </button>
                    </div>
                </div>

                {inputType === 'url' ? (
                    <div className="p-4">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                            placeholder="https://example.com/sitemap.xml"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                        />
                    </div>
                ) : (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste your sitemap XML content here..."
                        className="w-full h-48 p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed"
                    />
                )}

                <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-end">
                    <button
                        onClick={handleExtract}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                Extracting...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">output</span>
                                Extract URLs
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Results */}
            {urls.length > 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                    {/* Toolbar */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Extracted URLs ({filteredUrls.length} of {urls.length})
                            </span>
                            <input
                                type="text"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Filter URLs..."
                                className="px-3 py-1.5 text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/50 w-48"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value as 'plain' | 'csv' | 'json')}
                                className="px-2 py-1.5 text-xs bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg focus:outline-none dark:[color-scheme:dark]"
                            >
                                <option value="plain">Plain Text</option>
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                            </select>
                            <button
                                onClick={copyUrls}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                            >
                                <span className="material-symbols-outlined text-[14px]">
                                    {copied ? 'check' : 'content_copy'}
                                </span>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                            <button
                                onClick={downloadUrls}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all"
                            >
                                <span className="material-symbols-outlined text-[14px]">download</span>
                                Download
                            </button>
                        </div>
                    </div>

                    {/* URL List */}
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full">
                            <thead className="sticky top-0 bg-gray-50 dark:bg-surface-dark text-left border-b border-gray-100 dark:border-white/5">
                                <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th className="px-4 py-2 w-8">#</th>
                                    <th className="px-4 py-2">URL</th>
                                    <th className="px-4 py-2 w-28">Last Modified</th>
                                    <th className="px-4 py-2 w-24">Frequency</th>
                                    <th className="px-4 py-2 w-18">Priority</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {filteredUrls.map((url, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 group">
                                        <td className="px-4 py-2 text-xs text-gray-400">{idx + 1}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <a
                                                    href={url.loc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-mono text-primary hover:underline truncate max-w-md"
                                                >
                                                    {url.loc}
                                                </a>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(url.loc)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">content_copy</span>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{url.lastmod || '—'}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{url.changefreq || '—'}</td>
                                        <td className="px-4 py-2 text-xs text-gray-500">{url.priority || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
