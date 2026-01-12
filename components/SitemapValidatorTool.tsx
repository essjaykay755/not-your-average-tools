"use client";

import React, { useState } from 'react';

interface ValidationIssue {
    type: 'error' | 'warning' | 'info';
    message: string;
    line?: number;
}

interface ValidationResult {
    isValid: boolean;
    urlCount: number;
    issues: ValidationIssue[];
    urls: string[];
}

export const SitemapValidatorTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [inputType, setInputType] = useState<'url' | 'xml'>('xml');
    const [result, setResult] = useState<ValidationResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateXML = (xml: string): ValidationResult => {
        const issues: ValidationIssue[] = [];
        const urls: string[] = [];
        let isValid = true;

        // Check XML declaration
        if (!xml.trim().startsWith('<?xml')) {
            issues.push({
                type: 'warning',
                message: 'Missing XML declaration (<?xml version="1.0" encoding="UTF-8"?>)',
                line: 1
            });
        }

        // Check for urlset root element
        if (!xml.includes('<urlset')) {
            issues.push({
                type: 'error',
                message: 'Missing <urlset> root element',
            });
            isValid = false;
        }

        // Check for proper namespace
        if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/')) {
            issues.push({
                type: 'warning',
                message: 'Missing or incorrect sitemap namespace declaration',
            });
        }

        // Parse and validate URLs
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'text/xml');

        const parserError = doc.querySelector('parsererror');
        if (parserError) {
            issues.push({
                type: 'error',
                message: 'XML parsing error: ' + parserError.textContent?.slice(0, 100),
            });
            isValid = false;
        } else {
            // Extract URLs
            const urlElements = doc.querySelectorAll('url');

            if (urlElements.length === 0) {
                issues.push({
                    type: 'warning',
                    message: 'No <url> elements found in the sitemap',
                });
            }

            urlElements.forEach((urlEl, idx) => {
                const loc = urlEl.querySelector('loc');
                if (!loc || !loc.textContent) {
                    issues.push({
                        type: 'error',
                        message: `URL entry #${idx + 1} is missing required <loc> element`,
                    });
                    isValid = false;
                } else {
                    const urlValue = loc.textContent.trim();
                    urls.push(urlValue);

                    // Validate URL format
                    try {
                        new URL(urlValue);
                    } catch {
                        issues.push({
                            type: 'error',
                            message: `Invalid URL format: "${urlValue}"`,
                        });
                        isValid = false;
                    }

                    // Check for common issues
                    if (urlValue.includes(' ')) {
                        issues.push({
                            type: 'error',
                            message: `URL contains spaces: "${urlValue}"`,
                        });
                        isValid = false;
                    }

                    if (!urlValue.startsWith('http://') && !urlValue.startsWith('https://')) {
                        issues.push({
                            type: 'error',
                            message: `URL must start with http:// or https://: "${urlValue}"`,
                        });
                        isValid = false;
                    }
                }

                // Check optional elements
                const lastmod = urlEl.querySelector('lastmod');
                if (lastmod && lastmod.textContent) {
                    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|Z)?)?$/;
                    if (!dateRegex.test(lastmod.textContent.trim())) {
                        issues.push({
                            type: 'warning',
                            message: `Invalid date format in <lastmod>: "${lastmod.textContent}"`,
                        });
                    }
                }

                const priority = urlEl.querySelector('priority');
                if (priority && priority.textContent) {
                    const pVal = parseFloat(priority.textContent);
                    if (isNaN(pVal) || pVal < 0 || pVal > 1) {
                        issues.push({
                            type: 'warning',
                            message: `Priority should be between 0.0 and 1.0: "${priority.textContent}"`,
                        });
                    }
                }

                const changefreq = urlEl.querySelector('changefreq');
                if (changefreq && changefreq.textContent) {
                    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
                    if (!validFreqs.includes(changefreq.textContent.trim().toLowerCase())) {
                        issues.push({
                            type: 'warning',
                            message: `Invalid changefreq value: "${changefreq.textContent}"`,
                        });
                    }
                }
            });

            // Check for duplicate URLs
            const uniqueUrls = new Set(urls);
            if (uniqueUrls.size !== urls.length) {
                issues.push({
                    type: 'warning',
                    message: `Found ${urls.length - uniqueUrls.size} duplicate URLs`,
                });
            }

            // Size recommendations
            if (urls.length > 50000) {
                issues.push({
                    type: 'warning',
                    message: `Sitemap contains ${urls.length} URLs. Recommended limit is 50,000 per file`,
                });
            }

            if (isValid && issues.filter(i => i.type === 'error').length === 0) {
                issues.unshift({
                    type: 'info',
                    message: '✓ Sitemap is valid and well-formed',
                });
            }
        }

        return { isValid, urlCount: urls.length, issues, urls };
    };

    const handleValidate = async () => {
        setError(null);
        setResult(null);

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

            const validationResult = validateXML(xmlContent);
            setResult(validationResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Validation failed');
        } finally {
            setLoading(false);
        }
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
                            placeholder="https://example.com/sitemap.xml"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                        />
                    </div>
                ) : (
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-01</lastmod>
  </url>
</urlset>`}
                        className="w-full h-64 p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed"
                    />
                )}

                <div className="px-4 py-3 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-end">
                    <button
                        onClick={handleValidate}
                        disabled={loading}
                        className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                Validating...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                Validate
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
            {result && (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`rounded-xl p-4 border ${result.isValid ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`material-symbols-outlined text-2xl ${result.isValid ? 'text-green-500' : 'text-red-500'}`}>
                                    {result.isValid ? 'check_circle' : 'error'}
                                </span>
                                <span className={`text-sm font-semibold ${result.isValid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {result.isValid ? 'Valid' : 'Invalid'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sitemap Status</p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-2xl text-blue-500">link</span>
                                <span className="text-xl font-bold text-blue-700 dark:text-blue-400">{result.urlCount}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total URLs</p>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-2xl text-amber-500">warning</span>
                                <span className="text-xl font-bold text-amber-700 dark:text-amber-400">
                                    {result.issues.filter(i => i.type !== 'info').length}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Issues Found</p>
                        </div>
                    </div>

                    {/* Issues List */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                Validation Results
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-white/5 max-h-80 overflow-y-auto">
                            {result.issues.map((issue, idx) => (
                                <div key={idx} className="p-4 flex items-start gap-3">
                                    <span className={`material-symbols-outlined text-lg shrink-0 ${issue.type === 'error' ? 'text-red-500' :
                                            issue.type === 'warning' ? 'text-amber-500' :
                                                'text-green-500'
                                        }`}>
                                        {issue.type === 'error' ? 'error' :
                                            issue.type === 'warning' ? 'warning' :
                                                'check_circle'}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{issue.message}</p>
                                        {issue.line && (
                                            <p className="text-xs text-gray-400 mt-1">Line {issue.line}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
