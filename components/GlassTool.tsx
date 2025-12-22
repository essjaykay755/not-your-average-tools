"use client";

import React, { useState, useRef } from 'react';
import { Copy, Layers, CheckCircle, Image as ImageIcon, PaintBucket, MoveVertical } from 'lucide-react';

export const GlassTool: React.FC = () => {
    const [blur, setBlur] = useState(16);
    const [transparency, setTransparency] = useState(0.25);
    const [saturation, setSaturation] = useState(180);
    const [outline, setOutline] = useState(true);
    const [copied, setCopied] = useState(false);

    // New Settings
    const [bgImage, setBgImage] = useState<string>('blobs'); // 'blobs' | 'mesh' | 'mountain' | 'city'
    const [isScrollable, setIsScrollable] = useState(false);

    // Generate CSS
    const bgColor = `rgba(255, 255, 255, ${transparency})`;
    const border = outline ? '1px solid rgba(255, 255, 255, 0.3)' : 'none';

    const cssCode = `background: ${bgColor};
backdrop-filter: blur(${blur}px) saturate(${saturation}%);
-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);
border: ${outline ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'};
border-radius: 20px;
box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getBackgroundStyle = () => {
        switch (bgImage) {
            case 'mountain': return { backgroundImage: 'url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000)' };
            case 'city': return { backgroundImage: 'url(https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000)' };
            case 'mesh': return { backgroundImage: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0px, transparent 50%)', backgroundColor: '#e5e5f7' };
            default: return {};
        }
    };

    return (
        <div className="w-full min-h-[600px] flex flex-col xl:flex-row gap-8 items-start">

            {/* Left: Preview Area (Expanded) */}
            <div className={`relative flex-1 w-full flex flex-col items-center justify-between rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-2xl bg-[#121212] transition-all duration-300 ${isScrollable ? 'h-[700px]' : 'min-h-[600px]'}`}>

                {/* Scrollable Container Wrapper */}
                <div
                    className={`absolute inset-0 w-full ${isScrollable ? 'overflow-y-auto cursor-ns-resize' : 'overflow-hidden'}`}
                >
                    {/* The Background Content */}
                    <div
                        className={`w-full relative transition-all duration-500 bg-cover bg-center ${isScrollable ? 'h-[200%]' : 'h-full'}`}
                        style={getBackgroundStyle()}
                    >
                        {/* Default Blobs (only if no image) */}
                        {bgImage === 'blobs' && (
                            <div className="absolute inset-0 w-full h-full overflow-hidden">
                                <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob ${isScrollable ? 'fixed top-1/4' : ''}`}></div>
                                <div className={`absolute top-1/4 right-1/4 w-64 h-64 bg-yellow-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000 ${isScrollable ? 'fixed top-1/4' : ''}`}></div>
                                <div className={`absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000 ${isScrollable ? 'fixed bottom-1/4' : ''}`}></div>
                            </div>
                        )}

                        {/* Sticky Container for Card */}
                        <div className={`w-full h-full flex items-center justify-center p-8 ${isScrollable ? 'items-start pt-32' : ''}`}>
                            {/* The Glass Card */}
                            <div
                                className={`relative z-20 w-full max-w-sm p-8 text-white transition-all duration-300 ${isScrollable ? 'sticky top-32' : ''}`}
                                style={{
                                    background: bgColor,
                                    backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                                    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                                    border: border,
                                    borderRadius: '20px',
                                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                                }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg">Glassmorphism</h2>
                                        <p className="text-xs opacity-70">Credit Card / Profile</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/20 rounded-full"></div>
                                    <div className="h-2 w-2/3 bg-white/20 rounded-full"></div>
                                    <div className="h-2 w-1/2 bg-white/20 rounded-full"></div>
                                </div>
                                <button className="mt-8 w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-bold text-sm border border-white/10">
                                    Awesome Effect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Block (Floating at Bottom) */}
                <div className="relative z-30 w-[95%] mb-6 bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl group mx-auto mt-auto">
                    <pre className="text-xs md:text-sm font-mono text-gray-300 overflow-x-auto">
                        <code>{cssCode}</code>
                    </pre>
                    <button
                        onClick={copyToClipboard}
                        className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all shadow-lg backdrop-blur-sm"
                        title="Copy CSS"
                    >
                        {copied ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Right: Controls */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col gap-6">
                    <h3 className="font-bold text-lg text-text-main dark:text-white border-b border-gray-100 dark:border-white/5 pb-4">
                        Adjustments
                    </h3>

                    {/* Blur */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Blur</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {blur}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            step="0.5"
                            value={blur}
                            onChange={(e) => setBlur(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Transparency */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Transparency</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {Math.round(transparency * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={transparency}
                            onChange={(e) => setTransparency(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Saturation */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Saturation</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {saturation}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            step="1"
                            value={saturation}
                            onChange={(e) => setSaturation(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Outline Toggle */}
                    <button
                        onClick={() => setOutline(!outline)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${outline
                                ? 'bg-primary/5 border-primary text-primary font-bold'
                                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                    >
                        <span className="text-sm">Outline Border</span>
                        {outline && <CheckCircle className="w-4 h-4" />}
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>

                    {/* Background Settings */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-text-main dark:text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            Background Style
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['blobs', 'mesh', 'mountain', 'city'].map((bg) => (
                                <button
                                    key={bg}
                                    onClick={() => setBgImage(bg)}
                                    className={`p-2 rounded-lg text-xs font-medium capitalize border transition-all ${bgImage === bg
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {bg}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Toggle */}
                    <button
                        onClick={() => setIsScrollable(!isScrollable)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${isScrollable
                                ? 'bg-primary/5 border-primary text-primary font-bold'
                                : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                    >
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-sm flex items-center gap-2">
                                <MoveVertical className="w-4 h-4" />
                                Scrollable Background
                            </span>
                            <span className="text-[10px] opacity-70 font-normal text-left">
                                Test parallax/fixed effects.
                            </span>
                        </div>
                        {isScrollable && <CheckCircle className="w-4 h-4" />}
                    </button>

                </div>
            </div>

        </div>
    );
};
