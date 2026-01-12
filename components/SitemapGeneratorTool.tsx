"use client";

import React, { useState, useMemo } from 'react';

interface SitemapUrl {
    id: string;
    loc: string;
    lastmod: string;
    changefreq: string;
    priority: string;
}

const CHANGEFREQ_OPTIONS = ['', 'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
const PRIORITY_OPTIONS = ['', '0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'];

export const SitemapGeneratorTool: React.FC = () => {
    const [urls, setUrls] = useState<SitemapUrl[]>([
        { id: '1', loc: '', lastmod: '', changefreq: '', priority: '' }
    ]);
    const [bulkInput, setBulkInput] = useState('');
    const [showBulkInput, setShowBulkInput] = useState(false);
    const [copied, setCopied] = useState(false);

    const addUrl = () => {
        setUrls([...urls, {
            id: Date.now().toString(),
            loc: '',
            lastmod: '',
            changefreq: '',
            priority: ''
        }]);
    };

    const removeUrl = (id: string) => {
        if (urls.length > 1) {
            setUrls(urls.filter(u => u.id !== id));
        }
    };

    const updateUrl = (id: string, field: keyof SitemapUrl, value: string) => {
        setUrls(urls.map(u =>
            u.id === id ? { ...u, [field]: value } : u
        ));
    };

    const handleBulkImport = () => {
        const lines = bulkInput.split('\n').filter(line => line.trim());
        const newUrls = lines.map(line => ({
            id: Date.now().toString() + Math.random(),
            loc: line.trim(),
            lastmod: new Date().toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.5'
        }));

        if (newUrls.length > 0) {
            // Replace empty first entry or append
            if (urls.length === 1 && !urls[0].loc) {
                setUrls(newUrls);
            } else {
                setUrls([...urls, ...newUrls]);
            }
        }
        setBulkInput('');
        setShowBulkInput(false);
    };

    const generatedXml = useMemo(() => {
        const validUrls = urls.filter(u => u.loc.trim());

        if (validUrls.length === 0) return '';

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        validUrls.forEach(url => {
            xml += `
  <url>
    <loc>${escapeXml(url.loc.trim())}</loc>`;

            if (url.lastmod) {
                xml += `
    <lastmod>${url.lastmod}</lastmod>`;
            }
            if (url.changefreq) {
                xml += `
    <changefreq>${url.changefreq}</changefreq>`;
            }
            if (url.priority) {
                xml += `
    <priority>${url.priority}</priority>`;
            }

            xml += `
  </url>`;
        });

        xml += `
</urlset>`;

        return xml;
    }, [urls]);

    const escapeXml = (str: string): string => {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedXml);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadXml = () => {
        const blob = new Blob([generatedXml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        a.click();
        URL.revokeObjectURL(url);
    };

    const validUrlCount = urls.filter(u => u.loc.trim()).length;

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-6xl mx-auto p-4 md:p-8 gap-6">
            {/* URL Editor */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        URLs ({validUrlCount})
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowBulkInput(!showBulkInput)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-primary border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                        >
                            <span className="material-symbols-outlined text-[14px] mr-1 align-middle">playlist_add</span>
                            Bulk Import
                        </button>
                        <button
                            onClick={addUrl}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all"
                        >
                            <span className="material-symbols-outlined text-[14px] mr-1 align-middle">add</span>
                            Add URL
                        </button>
                    </div>
                </div>

                {/* Bulk Import */}
                {showBulkInput && (
                    <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-blue-50 dark:bg-blue-900/10">
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            Paste URLs (one per line)
                        </label>
                        <textarea
                            value={bulkInput}
                            onChange={(e) => setBulkInput(e.target.value)}
                            placeholder="https://example.com/page-1&#10;https://example.com/page-2&#10;https://example.com/page-3"
                            className="w-full h-32 px-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setShowBulkInput(false)}
                                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkImport}
                                className="px-4 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
                            >
                                Import
                            </button>
                        </div>
                    </div>
                )}

                {/* URL List */}
                <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-white/5 text-left">
                            <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                <th className="px-4 py-2">URL (loc) *</th>
                                <th className="px-4 py-2 w-36">Last Modified</th>
                                <th className="px-4 py-2 w-28">Change Freq</th>
                                <th className="px-4 py-2 w-20">Priority</th>
                                <th className="px-4 py-2 w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {urls.map((url) => (
                                <tr key={url.id} className="hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            value={url.loc}
                                            onChange={(e) => updateUrl(url.id, 'loc', e.target.value)}
                                            placeholder="https://example.com/page"
                                            className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-primary rounded text-sm font-mono focus:outline-none"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="date"
                                            value={url.lastmod}
                                            onChange={(e) => updateUrl(url.id, 'lastmod', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-primary rounded text-sm focus:outline-none dark:[color-scheme:dark]"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={url.changefreq}
                                            onChange={(e) => updateUrl(url.id, 'changefreq', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-primary rounded text-sm focus:outline-none dark:[color-scheme:dark]"
                                        >
                                            {CHANGEFREQ_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt || '—'}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <select
                                            value={url.priority}
                                            onChange={(e) => updateUrl(url.id, 'priority', e.target.value)}
                                            className="w-full px-2 py-1.5 bg-transparent border border-transparent hover:border-gray-200 dark:hover:border-white/10 focus:border-primary rounded text-sm focus:outline-none dark:[color-scheme:dark]"
                                        >
                                            {PRIORITY_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt || '—'}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => removeUrl(url.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            disabled={urls.length === 1}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Generated XML */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Generated Sitemap XML
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            disabled={!generatedXml}
                            className="flex items-center gap-1 text-xs text-text-sub hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[14px]">
                                {copied ? 'check' : 'content_copy'}
                            </span>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={downloadXml}
                            disabled={!generatedXml}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-[14px]">download</span>
                            Download .xml
                        </button>
                    </div>
                </div>
                <pre className="p-4 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-auto max-h-80 whitespace-pre-wrap bg-gray-50 dark:bg-black/20">
                    {generatedXml || 'Add URLs above to generate your sitemap...'}
                </pre>
            </div>
        </div>
    );
};
