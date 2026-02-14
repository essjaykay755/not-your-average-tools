"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';
import { PRISM_THEMES, PrismThemeKey } from '../data/prismThemes';
import * as htmlToImage from 'html-to-image';
import {
    Download,
    Plus,
    Minus,
    Square,
    X,
    Image as ImageIcon,
    ChevronLeft,
    ChevronRight,
    Layout,
    Type,
    Check,
    Palette,
    Monitor,
    Smartphone,
    Tablet,
    Projector,
    Copy,
    ZoomIn,
    ZoomOut,
    Maximize,
} from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA CONSTANTS ---

const LANGUAGES = [
    { name: 'JavaScript', value: 'javascript' },
    { name: 'TypeScript', value: 'typescript' },
    { name: 'JSX', value: 'jsx' },
    { name: 'TSX', value: 'tsx' },
    { name: 'CSS', value: 'css' },
    { name: 'JSON', value: 'json' },
    { name: 'Python', value: 'python' },
    { name: 'Markdown', value: 'markdown' },
    { name: 'Bash', value: 'bash' },
    { name: 'SQL', value: 'sql' },
];

const BACKGROUNDS = [
    { name: 'Cosmic', value: 'linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #000000 100%)' }, // Deep Purple/Black
    { name: 'Candy', value: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #6366f1 100%)' }, // Pink/Purple/Indigo
    { name: 'Ocean', value: 'linear-gradient(135deg, #164e63 0%, #1e3a8a 50%, #0f172a 100%)' }, // Cyan/Blue/Dark
    { name: 'Sunset', value: 'linear-gradient(135deg, #f97316 0%, #db2777 50%, #7c3aed 100%)' }, // Orange/Pink/Purple
    { name: 'Midnight', value: '#18181b' }, // Zinc 950
    { name: 'Emerald', value: 'linear-gradient(135deg, #064e3b 0%, #115e59 50%, #022c22 100%)' }, // Green/Teal
    { name: 'Aurora', value: 'linear-gradient(135deg, #86efac 0%, #3b82f6 50%, #9333ea 100%)' }, // Green/Blue/Purple
    { name: 'Glassy', value: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' },
];

const WINDOW_THEMES = [
    { id: 'mac', label: 'MacOS', class: 'border border-white/10 bg-[#1e1e1e]', bg: '#1e1e1e' },
    { id: 'win11', label: 'Win 11', class: 'border border-white/10 bg-[#1e1e1e]', bg: '#1e1e1e' },
    { id: 'neon', label: 'Neon', class: 'border border-purple-500/50 bg-[#0a0a0a] shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)]', bg: '#0a0a0a' },
    { id: 'minimal', label: 'Minimal', class: 'border border-transparent bg-[#1e1e1e] shadow-xl', bg: '#1e1e1e' },
];

const ASPECT_RATIOS = [
    { id: 'auto', label: 'Auto', w: 0, h: 0, icon: Layout },
    { id: '16:9', label: '16:9', w: 1920, h: 1080, icon: Monitor },
    { id: '4:3', label: '4:3', w: 1200, h: 900, icon: Tablet },
    { id: '1:1', label: '1:1', w: 1080, h: 1080, icon: Square },
    { id: '9:16', label: '9:16', w: 1080, h: 1920, icon: Smartphone },
];

// --- COMPONENTS ---

export const CodeSnippetGeneratorTool: React.FC = () => {
    // Content State
    const [code, setCode] = useState(`const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');`);
    const [title, setTitle] = useState('index.ts');
    const [language, setLanguage] = useState('typescript');
    const [theme, setTheme] = useState<PrismThemeKey>('tomorrow');

    // Appearance State
    const [background, setBackground] = useState(BACKGROUNDS[0].value);
    const [customBg, setCustomBg] = useState<string | null>(null);
    const [windowThemeId, setWindowThemeId] = useState('mac');
    const [snippetWidth, setSnippetWidth] = useState(600); // Inner window width
    const [windowScale, setWindowScale] = useState(1); // Scale of inner window
    const [watermarkText, setWatermarkText] = useState('NotYourAverage.Tools');

    // Glass
    const [glassEnabled, setGlassEnabled] = useState(true);
    const [glassBlur, setGlassBlur] = useState(16);
    const [glassOpacity, setGlassOpacity] = useState(70);

    // Layout
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedAspectRatio, setSelectedAspectRatio] = useState(ASPECT_RATIOS[0]); // Default Auto
    const [canvasScale, setCanvasScale] = useState(0.6); // Viewport zoom
    const [exportScale, setExportScale] = useState(2); // Export pixel ratio (1x to 4x)

    const exportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Prism Highlighting
    const highlight = useCallback((code: string) => {
        return Prism.highlight(
            code,
            Prism.languages[language] || Prism.languages.javascript,
            language
        );
    }, [language]);

    // Handle File Upload
    const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setCustomBg(event.target.result as string);
                    setBackground(event.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    // Auto-Fit Canvas Logic
    const handleFitScreen = useCallback(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const availableW = container.clientWidth - 160; // Padding
        const availableH = container.clientHeight - 160;

        let targetW = 800; // Default auto
        let targetH = 600;

        if (selectedAspectRatio.id !== 'auto') {
            targetW = selectedAspectRatio.w;
            targetH = selectedAspectRatio.h;
        } else if (exportRef.current) {
            // Measure actual content if possible in auto mode
            targetW = exportRef.current.clientWidth;
            targetH = exportRef.current.clientHeight;
        }

        const scaleW = availableW / targetW;
        const scaleH = availableH / targetH;

        // Fit logic: min of scale ratios, capped typically at 1 (or allow slight zoom in for small screens)
        // Default to showing full content comfortably
        const newScale = Math.min(scaleW, scaleH);

        setCanvasScale(Math.max(0.1, Math.min(1, newScale)));
    }, [selectedAspectRatio]);

    // Initial fit
    useEffect(() => {
        const timer = setTimeout(handleFitScreen, 100);
        return () => clearTimeout(timer);
    }, [handleFitScreen]);

    const handleDownload = async () => {
        if (!exportRef.current) return;
        try {
            const dataUrl = await htmlToImage.toPng(exportRef.current, {
                pixelRatio: exportScale,
                cacheBust: true,
                skipFonts: true,
                // Force specific dimensions to match the aspect ratio presets (unless auto)
                width: selectedAspectRatio.id !== 'auto' ? selectedAspectRatio.w : undefined,
                height: selectedAspectRatio.id !== 'auto' ? selectedAspectRatio.h : undefined,
                onClone: (clonedNode: HTMLElement) => {
                    const innerWindow = clonedNode.querySelector('#snippet-window') as HTMLElement;
                    if (innerWindow) {
                        innerWindow.style.transition = 'none';
                        innerWindow.style.transform = `scale(${windowScale})`; // Ensure scale is locked
                    }
                }
            } as any);
            const link = document.createElement('a');
            const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'snippet';
            link.download = `${sanitizedTitle}-NotYourAverageTools-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export', err);
        }
    };

    // Helper: Window Controls Render
    const renderWindowControls = () => {
        if (windowThemeId === 'mac') {
            return (
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
            );
        }
        if (windowThemeId === 'win11') {
            return (
                <div className="flex gap-4 items-center px-1">
                    <Minus size={10} className="text-gray-400" />
                    <Square size={8} className="text-gray-400" />
                    <X size={10} className="text-gray-400" />
                </div>
            );
        }
        if (windowThemeId === 'neon') {
            return (
                <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                </div>
            );
        }
        return null; // Minimal
    };

    return (
        <div className="flex h-[95vh] min-h-[800px] w-full overflow-hidden bg-transparent text-text-main dark:text-white font-sans transition-colors">
            <style dangerouslySetInnerHTML={{ __html: PRISM_THEMES[theme].css }} />

            {/* --- SIDEBAR --- */}
            <AnimatePresence mode="wait">
                {sidebarOpen && (
                    <motion.div
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        className="w-[360px] h-full flex flex-col border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#171717] z-40 shrink-0 shadow-xl relative"
                    >
                        {/* Sidebar Header */}
                        <div className="p-5 border-b border-gray-200 dark:border-white/5 flex items-center justify-between">
                            <h2 className="font-bold text-lg text-text-main dark:text-white">
                                Options
                            </h2>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-text-sub dark:text-gray-500 transition-colors">
                                <ChevronLeft size={18} />
                            </button>
                        </div>

                        {/* Sidebar Content */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">

                            {/* FILE DETAILS */}
                            <div className="space-y-4 pt-1">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-wider">Snippet Details</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-text-main dark:text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="File Title (e.g. index.ts)"
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-text-main dark:text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-[#171717] dark:[&>option]:text-white"
                                        >
                                            {LANGUAGES.map(l => <option key={l.value} value={l.value} className="bg-white text-black dark:bg-[#171717] dark:text-white">{l.name}</option>)}
                                        </select>
                                        <select
                                            value={theme}
                                            onChange={(e) => setTheme(e.target.value as PrismThemeKey)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-text-main dark:text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all [&>option]:bg-white [&>option]:text-black dark:[&>option]:bg-[#171717] dark:[&>option]:text-white"
                                        >
                                            {Object.entries(PRISM_THEMES).map(([k, v]) => (
                                                <option key={k} value={k} className="bg-white text-black dark:bg-[#171717] dark:text-white">{v.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-white/5" />

                            {/* Aspect Ratio */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-wider">Canvas Size</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {ASPECT_RATIOS.map(ratio => (
                                        <button
                                            key={ratio.id}
                                            onClick={() => setSelectedAspectRatio(ratio)}
                                            className={clsx(
                                                "flex flex-col items-center justify-center p-2 rounded-lg border transition-all gap-1",
                                                selectedAspectRatio.id === ratio.id
                                                    ? "bg-primary/5 border-primary text-primary"
                                                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-text-sub dark:text-gray-500 hover:border-gray-300 dark:hover:border-white/10 hover:text-text-main dark:hover:text-gray-300"
                                            )}
                                        >
                                            <ratio.icon size={16} />
                                            <span className="text-[10px]">{ratio.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Window Props */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-wider">Window Settings</label>

                                {/* Width Slider */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-text-sub dark:text-gray-400">
                                        <span>Width</span>
                                        <span>{Math.round(snippetWidth * windowScale)}px</span>
                                    </div>
                                    <input
                                        type="range" min="300" max="1000" value={snippetWidth}
                                        onChange={(e) => setSnippetWidth(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                {/* Scale Slider */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-text-sub dark:text-gray-400">
                                        <span>Scale</span>
                                        <span>{Math.round(windowScale * 100)}%</span>
                                    </div>
                                    <input
                                        type="range" min="50" max="500" value={windowScale * 100}
                                        onChange={(e) => setWindowScale(Number(e.target.value) / 100)}
                                        className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>

                                {/* Style Buttons */}
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {WINDOW_THEMES.map(t => (
                                        <button
                                            key={t.id}
                                            onClick={() => setWindowThemeId(t.id)}
                                            className={clsx(
                                                "px-3 py-2 text-xs font-medium rounded-lg border transition-all",
                                                windowThemeId === t.id
                                                    ? "bg-white dark:bg-white/10 border-text-main dark:border-white text-text-main dark:text-white"
                                                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5 text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-gray-300"
                                            )}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Watermark Settings */}
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-text-sub dark:text-gray-400">
                                        <span>Watermark Text</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={watermarkText}
                                        onChange={(e) => setWatermarkText(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-text-main dark:text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                        placeholder="Watermark text..."
                                    />
                                </div>
                            </div>

                            {/* Glassmorphism */}
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">Glass Effect</span>
                                    <button
                                        onClick={() => setGlassEnabled(!glassEnabled)}
                                        className={clsx(
                                            "w-10 h-5 rounded-full relative transition-colors focus:ring-2 focus:ring-primary/50 focus:outline-none",
                                            glassEnabled ? "bg-primary" : "bg-gray-300 dark:bg-gray-700"
                                        )}
                                    >
                                        <div className={clsx("absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm", glassEnabled ? "left-6" : "left-1")} />
                                    </button>
                                </div>
                                {glassEnabled && (
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-text-sub dark:text-gray-500">
                                                <span>Blur</span>
                                                <span>{glassBlur}px</span>
                                            </div>
                                            <input type="range" min="0" max="40" value={glassBlur} onChange={e => setGlassBlur(Number(e.target.value))} className="w-full h-1 bg-gray-200 dark:bg-white/10 accent-primary rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-text-sub dark:text-gray-500">
                                                <span>Opacity</span>
                                                <span>{glassOpacity}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" value={glassOpacity} onChange={e => setGlassOpacity(Number(e.target.value))} className="w-full h-1 bg-gray-200 dark:bg-white/10 accent-primary rounded-lg appearance-none cursor-pointer" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Backgrounds */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-sub dark:text-gray-500 uppercase tracking-wider">Background</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {BACKGROUNDS.map(bg => (
                                        <button
                                            key={bg.name}
                                            onClick={() => setBackground(bg.value)}
                                            className={clsx(
                                                "aspect-square rounded-lg border-2 transition-all",
                                                background === bg.value ? "border-white dark:border-white scale-105 shadow-lg" : "border-transparent opacity-70 hover:opacity-100"
                                            )}
                                            style={{ background: bg.value }}
                                            title={bg.name}
                                        />
                                    ))}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className={clsx(
                                            "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center transition-all bg-gray-50 dark:bg-white/5",
                                            customBg && background === customBg ? "border-primary text-primary" : "border-gray-200 dark:border-white/10 text-text-sub dark:text-gray-600 hover:text-text-main dark:hover:text-gray-400"
                                        )}
                                    >
                                        <ImageIcon size={16} />
                                    </button>
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleCustomBgUpload} />
                            </div>

                        </div>

                        {/* Footer Action */}
                        <div className="p-5 border-t border-gray-200 dark:border-white/10 shrink-0 space-y-4">
                            {/* Export Resolution Slider */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-text-sub dark:text-gray-400">
                                    <span>Export Resolution</span>
                                    <span>{exportScale}x</span>
                                </div>
                                <input
                                    type="range" min="1" max="4" step="0.5" value={exportScale}
                                    onChange={(e) => setExportScale(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] text-text-sub dark:text-gray-500">
                                    <span>1x</span>
                                    <span className="text-primary font-medium">
                                        {selectedAspectRatio.id !== 'auto'
                                            ? `${Math.round(selectedAspectRatio.w * exportScale)} × ${Math.round(selectedAspectRatio.h * exportScale)}px`
                                            : `~${Math.round(800 * exportScale)} × ${Math.round(600 * exportScale)}px`
                                        }
                                    </span>
                                    <span>4x</span>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                <Download size={18} />
                                Export PNG
                            </button>
                        </div>

                        {/* Attached Toggle Button (Visible when open) */}
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-50 w-5 h-12 bg-white dark:bg-[#171717] border border-l-0 border-gray-200 dark:border-white/10 rounded-r-lg flex items-center justify-center text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer shadow-md"
                            title="Collapse Sidebar"
                        >
                            <ChevronLeft size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Detached Toggle Button (Visible when closed) */}
            <AnimatePresence>
                {!sidebarOpen && (
                    <motion.button
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-1/2 left-0 z-50 w-5 h-12 bg-white dark:bg-[#171717] border border-l-0 border-gray-200 dark:border-white/10 rounded-r-lg flex items-center justify-center text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer shadow-md -translate-y-1/2"
                        title="Expand Sidebar"
                    >
                        <ChevronRight size={14} />
                    </motion.button>
                )}
            </AnimatePresence>


            {/* --- PREVIEW AREA --- */}
            <div className="flex-1 relative overflow-auto flex items-center justify-center bg-transparent transition-colors">
                {/* Dotted Grid Background */}
                <div
                    className="absolute inset-0 opacity-[0.2] pointer-events-none dark:invert"
                    style={{ backgroundImage: 'radial-gradient(#888 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                />

                {/* ZOOM Controls for Preview */}
                <div className="absolute top-6 right-6 flex items-center gap-2 z-30 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 p-1.5 rounded-lg shadow-xl shadow-black/5">
                    <button onClick={() => setCanvasScale(Math.max(0.1, canvasScale - 0.1))} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-white transition-colors" title="Zoom Out">
                        <ZoomOut size={16} />
                    </button>
                    <span className="text-xs font-mono w-12 text-center text-text-sub dark:text-gray-400 select-none">
                        {Math.round(canvasScale * 100)}%
                    </span>
                    <button onClick={() => setCanvasScale(Math.min(3, canvasScale + 0.1))} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-white transition-colors" title="Zoom In">
                        <ZoomIn size={16} />
                    </button>
                    <div className="w-[1px] h-4 bg-gray-200 dark:bg-white/10 mx-1" />
                    <button onClick={handleFitScreen} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded text-text-sub dark:text-gray-500 hover:text-text-main dark:hover:text-white transition-colors" title="Fit to Screen">
                        <Maximize size={16} />
                    </button>
                </div>

                {/* Canvas Scroll Wrapper */}
                <div ref={containerRef} className="w-full h-full overflow-hidden flex items-center justify-center relative">
                    <div
                        className="transition-transform duration-200 ease-out origin-center"
                        style={{ transform: `scale(${canvasScale})` }}
                    >
                        {/* THE EXPORTABLE CONTAINER */}
                        <div
                            ref={exportRef}
                            className={clsx(
                                "relative overflow-hidden shadow-2xl flex items-center justify-center transition-all duration-300",
                                selectedAspectRatio.id === 'auto' ? "min-w-[800px] min-h-[600px] rounded-xl" : ""
                            )}
                            style={{
                                width: selectedAspectRatio.id !== 'auto' ? selectedAspectRatio.w : undefined,
                                height: selectedAspectRatio.id !== 'auto' ? selectedAspectRatio.h : undefined,
                                background: background.includes('gradient') || background.includes('#') ? background : `url(${background}) center/cover no-repeat`,
                            }}
                        >
                            {/* Inner Code Window */}
                            <div
                                id="snippet-window"
                                className={clsx(
                                    "relative transition-all duration-300 rounded-xl overflow-hidden",
                                    !glassEnabled && WINDOW_THEMES.find(t => t.id === windowThemeId)?.class
                                )}
                                style={{
                                    width: `${snippetWidth}px`,
                                    transform: `scale(${windowScale})`,
                                    transformOrigin: 'center center',
                                    border: glassEnabled ? 'none' : undefined,
                                }}
                            >
                                {/* Blurred background layer for glassmorphism (works in both preview and export) */}
                                {glassEnabled && (
                                    <div
                                        className="absolute z-0"
                                        style={{
                                            background: background.includes('gradient') || background.includes('#') ? background : `url(${background}) center/cover no-repeat`,
                                            filter: `blur(${glassBlur}px)`,
                                            top: -glassBlur * 2,
                                            left: -glassBlur * 2,
                                            right: -glassBlur * 2,
                                            bottom: -glassBlur * 2,
                                        }}
                                    />
                                )}
                                {/* Semi-transparent glass overlay */}
                                <div
                                    className="absolute inset-0 z-[1]"
                                    style={{
                                        backgroundColor: glassEnabled
                                            ? `rgba(${windowThemeId === 'neon' ? '10,10,10' : '30,30,30'}, ${glassOpacity / 100})`
                                            : (WINDOW_THEMES.find(t => t.id === windowThemeId)?.bg || '#1e1e1e'),
                                    }}
                                />
                                {/* Window Header - needs higher z-index */}
                                <div className="relative z-10">
                                    {windowThemeId !== 'minimal' && (
                                        <div className={clsx(
                                            "px-4 py-3 flex items-center justify-between border-b transition-colors",
                                            windowThemeId === 'ubuntu' ? "bg-[#333] border-black/10" : "bg-white/5 border-white/5"
                                        )}>
                                            <div className="flex-1 flex justify-start">{windowThemeId !== 'win11' && renderWindowControls()}</div>
                                            <div className={clsx("text-xs font-medium opacity-60 truncate px-2", windowThemeId === 'neon' ? "text-purple-300" : "text-gray-400")}>
                                                {title}
                                            </div>
                                            <div className="flex-1 flex justify-end">{windowThemeId === 'win11' && renderWindowControls()}</div>
                                        </div>
                                    )}

                                    {/* Editor Content Render */}
                                    <div className="p-0 relative">
                                        <Editor
                                            value={code}
                                            onValueChange={setCode}
                                            highlight={highlight}
                                            padding={24}
                                            style={{
                                                fontFamily: '"Fira Code", "Fira Mono", monospace',
                                                fontSize: 14,
                                                backgroundColor: 'transparent',
                                            }}
                                            className={clsx(
                                                "min-h-[100px] cursor-text",
                                                windowThemeId === 'neon' ? "text-purple-50 drop-shadow-[0_0_2px_rgba(255,255,255,0.3)]" : "text-gray-200"
                                            )}
                                            textareaClassName="focus:outline-none"
                                        />
                                    </div>

                                    {/* Branding / Watermark */}
                                    <div className="absolute bottom-2 right-4 pointer-events-none opacity-30 text-[10px] font-bold tracking-widest text-white/50">
                                        {watermarkText}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
