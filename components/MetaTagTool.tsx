"use client";

import React, { useState } from "react";
import { Copy, Check, Code2, Globe, Share2 } from "lucide-react";

interface MetaData {
    // Basic
    title: string;
    description: string;
    keywords: string;
    author: string;
    // Open Graph
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;
    // Twitter
    twitterCard: string;
    twitterSite: string;
    twitterCreator: string;
    // Technical
    viewport: string;
    charset: string;
    robots: string;
    canonical: string;
}

export const MetaTagTool: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'opengraph' | 'twitter' | 'technical'>('basic');

    const [metaData, setMetaData] = useState<MetaData>({
        title: "My Website Title",
        description: "A compelling description of my website that will appear in search results.",
        keywords: "keyword1, keyword2, keyword3",
        author: "Author Name",
        ogTitle: "",
        ogDescription: "",
        ogImage: "https://example.com/og-image.jpg",
        ogUrl: "https://example.com",
        ogType: "website",
        ogSiteName: "My Website",
        twitterCard: "summary_large_image",
        twitterSite: "@username",
        twitterCreator: "@username",
        viewport: "width=device-width, initial-scale=1.0",
        charset: "UTF-8",
        robots: "index, follow",
        canonical: ""
    });

    const generateMetaTags = () => {
        const ogTitle = metaData.ogTitle || metaData.title;
        const ogDesc = metaData.ogDescription || metaData.description;
        const canonical = metaData.canonical || metaData.ogUrl;

        return `<!-- Primary Meta Tags -->
<title>${metaData.title}</title>
<meta charset="${metaData.charset}">
<meta name="viewport" content="${metaData.viewport}">
<meta name="title" content="${metaData.title}">
<meta name="description" content="${metaData.description}">
<meta name="keywords" content="${metaData.keywords}">
<meta name="author" content="${metaData.author}">
<meta name="robots" content="${metaData.robots}">
${canonical ? `<link rel="canonical" href="${canonical}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${metaData.ogType}">
<meta property="og:url" content="${metaData.ogUrl}">
<meta property="og:title" content="${ogTitle}">
<meta property="og:description" content="${ogDesc}">
<meta property="og:image" content="${metaData.ogImage}">
<meta property="og:site_name" content="${metaData.ogSiteName}">

<!-- Twitter -->
<meta name="twitter:card" content="${metaData.twitterCard}">
<meta name="twitter:url" content="${metaData.ogUrl}">
<meta name="twitter:title" content="${ogTitle}">
<meta name="twitter:description" content="${ogDesc}">
<meta name="twitter:image" content="${metaData.ogImage}">
<meta name="twitter:site" content="${metaData.twitterSite}">
<meta name="twitter:creator" content="${metaData.twitterCreator}">`;
    };

    const copyTags = () => {
        navigator.clipboard.writeText(generateMetaTags());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const InputField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    );

    const TextAreaField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl overflow-x-auto">
                <button
                    onClick={() => setActiveTab('basic')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'basic'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Code2 className="w-4 h-4" /> Basic SEO
                </button>
                <button
                    onClick={() => setActiveTab('opengraph')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'opengraph'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Globe className="w-4 h-4" /> Open Graph
                </button>
                <button
                    onClick={() => setActiveTab('twitter')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'twitter'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Share2 className="w-4 h-4" /> Twitter
                </button>
                <button
                    onClick={() => setActiveTab('technical')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'technical'
                            ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    ⚙️ Technical
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                {activeTab === 'basic' && (
                    <div className="space-y-4">
                        <InputField
                            label="Page Title"
                            value={metaData.title}
                            onChange={(v) => setMetaData({ ...metaData, title: v })}
                            placeholder="My Awesome Website"
                        />
                        <TextAreaField
                            label="Description"
                            value={metaData.description}
                            onChange={(v) => setMetaData({ ...metaData, description: v })}
                            placeholder="A compelling description..."
                        />
                        <InputField
                            label="Keywords"
                            value={metaData.keywords}
                            onChange={(v) => setMetaData({ ...metaData, keywords: v })}
                            placeholder="keyword1, keyword2, keyword3"
                        />
                        <InputField
                            label="Author"
                            value={metaData.author}
                            onChange={(v) => setMetaData({ ...metaData, author: v })}
                            placeholder="Your Name"
                        />
                    </div>
                )}

                {activeTab === 'opengraph' && (
                    <div className="space-y-4">
                        <InputField
                            label="OG Title (leave empty to use page title)"
                            value={metaData.ogTitle}
                            onChange={(v) => setMetaData({ ...metaData, ogTitle: v })}
                        />
                        <TextAreaField
                            label="OG Description (leave empty to use page description)"
                            value={metaData.ogDescription}
                            onChange={(v) => setMetaData({ ...metaData, ogDescription: v })}
                        />
                        <InputField
                            label="OG Image URL (1200x630px recommended)"
                            value={metaData.ogImage}
                            onChange={(v) => setMetaData({ ...metaData, ogImage: v })}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Site URL"
                                value={metaData.ogUrl}
                                onChange={(v) => setMetaData({ ...metaData, ogUrl: v })}
                            />
                            <InputField
                                label="Site Name"
                                value={metaData.ogSiteName}
                                onChange={(v) => setMetaData({ ...metaData, ogSiteName: v })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
                            <select
                                value={metaData.ogType}
                                onChange={(e) => setMetaData({ ...metaData, ogType: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="website">Website</option>
                                <option value="article">Article</option>
                                <option value="product">Product</option>
                                <option value="profile">Profile</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'twitter' && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Card Type</label>
                            <select
                                value={metaData.twitterCard}
                                onChange={(e) => setMetaData({ ...metaData, twitterCard: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="summary_large_image">Summary Large Image</option>
                                <option value="summary">Summary</option>
                                <option value="app">App</option>
                                <option value="player">Player</option>
                            </select>
                        </div>
                        <InputField
                            label="Site @username"
                            value={metaData.twitterSite}
                            onChange={(v) => setMetaData({ ...metaData, twitterSite: v })}
                            placeholder="@yoursite"
                        />
                        <InputField
                            label="Creator @username"
                            value={metaData.twitterCreator}
                            onChange={(v) => setMetaData({ ...metaData, twitterCreator: v })}
                            placeholder="@yourcreator"
                        />
                    </div>
                )}

                {activeTab === 'technical' && (
                    <div className="space-y-4">
                        <InputField
                            label="Viewport"
                            value={metaData.viewport}
                            onChange={(v) => setMetaData({ ...metaData, viewport: v })}
                        />
                        <InputField
                            label="Charset"
                            value={metaData.charset}
                            onChange={(v) => setMetaData({ ...metaData, charset: v })}
                        />
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Robots</label>
                            <select
                                value={metaData.robots}
                                onChange={(e) => setMetaData({ ...metaData, robots: e.target.value })}
                                className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="index, follow">Index, Follow (Recommended)</option>
                                <option value="index, nofollow">Index, No Follow</option>
                                <option value="noindex, follow">No Index, Follow</option>
                                <option value="noindex, nofollow">No Index, No Follow</option>
                            </select>
                        </div>
                        <InputField
                            label="Canonical URL (optional)"
                            value={metaData.canonical}
                            onChange={(v) => setMetaData({ ...metaData, canonical: v })}
                            placeholder="https://example.com/canonical-page"
                        />
                    </div>
                )}
            </div>

            {/* Output */}
            <div className="bg-[#1e1e1e] rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <span className="text-sm font-bold text-gray-400">Generated Meta Tags</span>
                    <button
                        onClick={copyTags}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-bold transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
                    {generateMetaTags()}
                </pre>
            </div>

            {/* Info */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-3">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Fill in your page details across Basic, Open Graph, Twitter, and Technical tabs
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        The tool generates complete, SEO-optimized meta tags in real-time
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Copy and paste the generated HTML into your page's &lt;head&gt; section
                    </li>
                </ul>
            </div>
        </div>
    );
};
