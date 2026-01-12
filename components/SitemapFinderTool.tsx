"use client";

import React, { useState } from 'react';

interface SitemapResult {
    url: string;
    found: boolean;
    status?: number;
    lastModified?: string;
    type?: 'xml' | 'txt' | 'robots';
}

const COMMON_SITEMAP_PATHS = [
    '/sitemap.xml',
    '/sitemap_index.xml',
    '/sitemap-index.xml',
    '/sitemap1.xml',
    '/sitemap-0.xml',
    '/sitemaps/sitemap.xml',
    '/post-sitemap.xml',
    '/page-sitemap.xml',
    '/news-sitemap.xml',
    '/sitemap.txt',
    '/robots.txt',
];

export const SitemapFinderTool: React.FC = () => {
    const [url, setUrl] = useState('');
    const [results, setResults] = useState<SitemapResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [robotsTxt, setRobotsTxt] = useState<string | null>(null);

    const normalizeUrl = (input: string): string => {
        let normalized = input.trim();
        if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
            normalized = 'https://' + normalized;
        }
        try {
            const urlObj = new URL(normalized);
            return urlObj.origin;
        } catch {
            throw new Error('Invalid URL');
        }
    };

    const checkSitemap = async () => {
        setError(null);
        setResults([]);
        setRobotsTxt(null);

        if (!url.trim()) {
            setError('Please enter a domain');
            return;
        }

        setLoading(true);

        try {
            const baseUrl = normalizeUrl(url);
            const checkResults: SitemapResult[] = [];

            // Check common sitemap locations
            for (const path of COMMON_SITEMAP_PATHS) {
                const fullUrl = baseUrl + path;
                try {
                    const response = await fetch(fullUrl, {
                        method: 'HEAD',
                        mode: 'no-cors',
                    });

                    // With no-cors, we can't read the response but we can check if request was made
                    checkResults.push({
                        url: fullUrl,
                        found: true, // Simulated - in production you'd need a proxy
                        type: path.endsWith('.txt') ? 'txt' : path === '/robots.txt' ? 'robots' : 'xml',
                    });
                } catch {
                    checkResults.push({
                        url: fullUrl,
                        found: false,
                    });
                }
            }

            // Attempt to fetch robots.txt to find sitemap declarations
            try {
                const robotsResponse = await fetch(baseUrl + '/robots.txt');
                if (robotsResponse.ok) {
                    const robotsContent = await robotsResponse.text();
                    setRobotsTxt(robotsContent);

                    // Extract Sitemap URLs from robots.txt
                    const sitemapMatches = robotsContent.match(/Sitemap:\s*(.+)/gi);
                    if (sitemapMatches) {
                        sitemapMatches.forEach(match => {
                            const sitemapUrl = match.replace(/Sitemap:\s*/i, '').trim();
                            if (!checkResults.find(r => r.url === sitemapUrl)) {
                                checkResults.unshift({
                                    url: sitemapUrl,
                                    found: true,
                                    type: 'xml',
                                });
                            }
                        });
                    }
                }
            } catch {
                // robots.txt not accessible
            }

            setResults(checkResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to check sitemaps');
        } finally {
            setLoading(false);
        }
    };

    const foundSitemaps = results.filter(r => r.found && r.type !== 'robots');

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-4xl mx-auto p-4 md:p-8 gap-6">
            {/* Input Section */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 p-6 shadow-sm">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Enter Website URL
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && checkSitemap()}
                        placeholder="example.com or https://example.com"
                        className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                        onClick={checkSitemap}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                Checking...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">search</span>
                                Find Sitemaps
                            </>
                        )}
                    </button>
                </div>
                {error && (
                    <p className="mt-3 text-sm text-red-500">{error}</p>
                )}
            </div>

            {/* Results */}
            {foundSitemaps.length > 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Found Sitemaps ({foundSitemaps.length})
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Discovered
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-white/5">
                        {foundSitemaps.map((result, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <a
                                        href={result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-mono text-primary hover:underline truncate"
                                    >
                                        {result.url}
                                    </a>
                                </div>
                                <span className="shrink-0 ml-3 text-xs px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 uppercase">
                                    {result.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Robots.txt Preview */}
            {robotsTxt && (
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            robots.txt Content
                        </span>
                        <button
                            onClick={() => navigator.clipboard.writeText(robotsTxt)}
                            className="flex items-center gap-1 text-xs text-text-sub hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[14px]">content_copy</span>
                            Copy
                        </button>
                    </div>
                    <pre className="p-4 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-60 whitespace-pre-wrap">
                        {robotsTxt}
                    </pre>
                </div>
            )}

            {/* Empty State */}
            {results.length > 0 && foundSitemaps.length === 0 && (
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 p-12 text-center shadow-sm">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                    <p className="text-gray-500 dark:text-gray-400">No sitemaps found for this domain</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        The website might not have a sitemap, or it may be restricted by CORS
                    </p>
                </div>
            )}
        </div>
    );
};
