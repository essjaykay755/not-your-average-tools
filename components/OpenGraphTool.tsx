"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

// Brand Icons as SVG components
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

interface OGData {
    title: string;
    description: string;
    image: string;
    url: string;
    siteName: string;
    type: string;
}

export const OpenGraphTool: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [activePreview, setActivePreview] = useState<'twitter' | 'facebook' | 'linkedin'>('twitter');

    const [data, setData] = useState<OGData>({
        title: "My Awesome Page",
        description: "This is a description of my awesome page that will appear in social media previews.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop",
        url: "https://example.com/page",
        siteName: "Example Site",
        type: "website"
    });

    const copyMetaTags = () => {
        const tags = `<!-- Open Graph / Facebook -->
<meta property="og:type" content="${data.type}">
<meta property="og:url" content="${data.url}">
<meta property="og:title" content="${data.title}">
<meta property="og:description" content="${data.description}">
<meta property="og:image" content="${data.image}">
<meta property="og:site_name" content="${data.siteName}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${data.url}">
<meta property="twitter:title" content="${data.title}">
<meta property="twitter:description" content="${data.description}">
<meta property="twitter:image" content="${data.image}">`;

        navigator.clipboard.writeText(tags);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getHostname = (url: string): string => {
        try {
            return new URL(url).hostname;
        } catch {
            return 'example.com';
        }
    };

    return (
        <div className="space-y-6">
            {/* Preview Tabs + Copy Button Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
                    <button
                        onClick={() => setActivePreview('twitter')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activePreview === 'twitter'
                            ? 'bg-white dark:bg-white/10 text-[#000000] dark:text-white shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <XIcon className="w-4 h-4" /> X (Twitter)
                    </button>
                    <button
                        onClick={() => setActivePreview('facebook')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activePreview === 'facebook'
                            ? 'bg-white dark:bg-white/10 text-[#1877F2] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <FacebookIcon className="w-4 h-4" /> Facebook
                    </button>
                    <button
                        onClick={() => setActivePreview('linkedin')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activePreview === 'linkedin'
                            ? 'bg-white dark:bg-white/10 text-[#0A66C2] shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        <LinkedInIcon className="w-4 h-4" /> LinkedIn
                    </button>
                </div>

                <button
                    onClick={copyMetaTags}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shrink-0"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Meta Tags'}
                </button>
            </div>

            {/* Preview Card + How It Works Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview Card */}
                <div>
                    {activePreview === 'twitter' && (
                        <div className="bg-white dark:bg-[#15202B] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            {data.image && (
                                <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
                                    <img src={data.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400 text-sm truncate">{getHostname(data.url)}</p>
                                <p className="text-text-main dark:text-white font-normal truncate">{data.title}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">{data.description}</p>
                            </div>
                        </div>
                    )}

                    {activePreview === 'facebook' && (
                        <div className="bg-white dark:bg-[#242526] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                            {data.image && (
                                <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
                                    <img src={data.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-3 bg-gray-100 dark:bg-[#3A3B3C]">
                                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">{getHostname(data.url)}</p>
                                <p className="text-text-main dark:text-white font-bold mt-1 line-clamp-2">{data.title}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-1">{data.description}</p>
                            </div>
                        </div>
                    )}

                    {activePreview === 'linkedin' && (
                        <div className="bg-white dark:bg-[#1D2226] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
                            {data.image && (
                                <div className="aspect-[1.91/1] bg-gray-100 dark:bg-gray-800 relative">
                                    <img src={data.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-3">
                                <p className="text-text-main dark:text-white font-semibold line-clamp-2">{data.title}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{getHostname(data.url)}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* How It Works */}
                <div className="bg-[#1e1e1e] rounded-2xl p-6 h-fit">
                    <h3 className="text-white font-bold mb-3">How It Works</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Enter your page metadata below to see live previews
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Switch between X, Facebook, and LinkedIn previews
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            Copy ready-to-use meta tags with one click
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            100% browser-based — your data never leaves your device
                        </li>
                    </ul>
                </div>
            </div>

            {/* Input Fields */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Page Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Site Name</label>
                        <input
                            type="text"
                            value={data.siteName}
                            onChange={(e) => setData({ ...data, siteName: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description</label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            rows={2}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">URL</label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={(e) => setData({ ...data, url: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Image URL</label>
                        <input
                            type="url"
                            value={data.image}
                            onChange={(e) => setData({ ...data, image: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
