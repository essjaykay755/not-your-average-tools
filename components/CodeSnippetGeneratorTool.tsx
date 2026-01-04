"use client";

import React, { useState, useRef, useEffect } from 'react';
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
import { Download, Copy, Moon, Sun, Monitor, Code2, Palette, Type, Layout, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';

// If adding more themes, we'd need to dynamically load CSS or use a different approach.
// For now, let's stick to a solid dark theme (tomorrow) which looks good for snippets.

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
    // Trending Gradients
    { name: 'Cotton Candy', value: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)' },
    { name: 'Paradise', value: 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)' },
    { name: 'Midnight City', value: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)' },
    { name: 'Purple Love', value: 'linear-gradient(135deg, #cc2b5e 0%, #753a88 100%)' },
    { name: 'Sunset Drive', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Northern Lights', value: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)' },
    { name: 'Passion', value: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)' },
    
    // Complex Mesh / Aura
    { name: 'Aura 1', value: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)' },
    { name: 'Aura 2', value: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0, transparent 50%)' },
    { name: 'Aura 3', value: 'radial-gradient(at 0% 100%, hsla(192,100%,50%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(280,100%,50%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(340,100%,70%,1) 0, transparent 50%)' },
    { name: 'Glassy', value: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0))' },
    
    // Deep & Dark
    { name: 'Deep Space', value: 'linear-gradient(to bottom, #000000, #434343)' },
    { name: 'Midnight', value: 'linear-gradient(to right, #232526, #414345)' },

    // Solids
    { name: 'Slate', value: '#1e293b' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Transparent', value: 'transparent' },
];

export const CodeSnippetGeneratorTool: React.FC = () => {
    const [code, setCode] = useState(`const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');`);
    const [language, setLanguage] = useState('typescript');
    const [background, setBackground] = useState(BACKGROUNDS[7].value); // Default to Aura 1
    const [customBg, setCustomBg] = useState<string | null>(null);
    const [windowControls, setWindowControls] = useState(true);
    const [darkMode, setDarkMode] = useState(true); // Inner window theme
    const [paddingX, setPaddingX] = useState(64);
    const [paddingY, setPaddingY] = useState(64);
    const [title, setTitle] = useState('Untitled-1');
    const [showLineNumbers, setShowLineNumbers] = useState(true);
    const [theme, setTheme] = useState<PrismThemeKey>('tomorrow');
    
    // Glassmorphism state
    const [isGlass, setIsGlass] = useState(false);
    const [glassBlur, setGlassBlur] = useState(16);
    const [glassOpacity, setGlassOpacity] = useState(0.7);

    const exportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const highlight = (code: string) => {
        return Prism.highlight(
            code,
            Prism.languages[language] || Prism.languages.javascript,
            language
        );
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
    };

    const handleDownload = async () => {
        if (!exportRef.current) return;

        try {
            const dataUrl = await htmlToImage.toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `snippet-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
            // console.log("Download temporarily disabled for debugging");
        } catch (err) {
            console.error('Failed to generate image', err);
        }
    };

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

    // Helper to get line numbers
    const LineNumbers = () => {
        const lines = code.split('\n').length;
        return (
            <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col items-end text-[12px] pt-[20px] pr-2 select-none opacity-40 font-mono" style={{ lineHeight: '21px' }} aria-hidden="true">
                {Array.from({ length: lines }).map((_, i) => (
                    <span key={i}>{i + 1}</span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 w-full max-w-none mx-auto min-h-[600px]">
             <style dangerouslySetInnerHTML={{ __html: PRISM_THEMES[theme].css }} />
            {/* Controls Side */}
            <div className="xl:w-[350px] flex flex-col gap-6 order-2 xl:order-1 h-fit">
                {/* Visual Settings */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-5 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Appearance
                    </h3>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-main dark:text-gray-300">Theme</label>
                        <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value as PrismThemeKey)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 outline-none focus:border-primary text-sm text-gray-900 dark:text-gray-100"
                        >
                            {Object.entries(PRISM_THEMES).map(([key, value]) => (
                                <option key={key} value={key} className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
                                    {value.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-5">
                        <label className="block text-sm font-medium text-text-main dark:text-gray-300">Language</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 outline-none focus:border-primary text-sm text-gray-900 dark:text-gray-100"
                        >
                            {LANGUAGES.map((lang) => (
                                <option key={lang.value} value={lang.value} className="bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100">
                                    {lang.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-5">
                        <label className="block text-sm font-medium text-text-main dark:text-gray-300">Background</label>
                        <div className="grid grid-cols-5 gap-3">
                            {BACKGROUNDS.map((bg) => {
                                const isGradient = bg.value.includes('gradient');
                                const style = isGradient
                                    ? {
                                        backgroundImage: bg.value,
                                        backgroundSize: '100% 100%',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'center',
                                    }
                                    : { backgroundColor: bg.value };

                                return (
                                    <button
                                        key={bg.name}
                                        onClick={() => { setBackground(bg.value); setCustomBg(null); }}
                                        className={clsx(
                                            "w-12 h-12 rounded-xl border-2 transition-all shadow-sm",
                                            background === bg.value ? "border-primary scale-105" : "border-transparent ring-1 ring-black/5 hover:scale-105"
                                        )}
                                        style={style}
                                        title={bg.name}
                                    />
                                );
                            })}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className={clsx(
                                    "w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center bg-gray-100 dark:bg-white/10",
                                    customBg && background === customBg ? "border-primary scale-105" : "border-transparent border-dashed border-gray-400 hover:scale-105"
                                )}
                                title="Upload Custom"
                                style={customBg ? { background: `url(${customBg}) center / 100% 100% no-repeat` } : {}}
                            >
                                {!customBg && <ImageIcon className="w-5 h-5 text-gray-400" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    handleCustomBgUpload(e);
                                    // Reset input so the same file can be selected again if needed
                                    e.target.value = '';
                                }}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-medium text-text-main dark:text-gray-300">Padding</label>
                        
                        {/* Horizontal Padding (Width) */}
                        <div className="space-y-2">
                             <div className="flex justify-between text-xs text-text-sub">
                                <span>Horizontal (Width)</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="128"
                                    value={paddingX}
                                    onChange={(e) => setPaddingX(Number(e.target.value))}
                                    className="flex-1 accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                />
                                <div className="relative w-20 shrink-0">
                                    <input
                                        type="number"
                                        min="0"
                                        max="128"
                                        value={paddingX}
                                        onChange={(e) => {
                                            const val = Math.min(Math.max(Number(e.target.value), 0), 128);
                                            setPaddingX(val);
                                        }}
                                        className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md text-center focus:border-primary outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-sub pointer-events-none">px</span>
                                </div>
                            </div>
                        </div>

                        {/* Vertical Padding (Height) */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-text-sub">
                                <span>Vertical (Height)</span>
                            </div>
                             <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="128"
                                    value={paddingY}
                                    onChange={(e) => setPaddingY(Number(e.target.value))}
                                    className="flex-1 accent-primary h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                />
                                <div className="relative w-20 shrink-0">
                                    <input
                                        type="number"
                                        min="0"
                                        max="128"
                                        value={paddingY}
                                        onChange={(e) => {
                                            const val = Math.min(Math.max(Number(e.target.value), 0), 128);
                                            setPaddingY(val);
                                        }}
                                        className="w-full px-2 py-1.5 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md text-center focus:border-primary outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-sub pointer-events-none">px</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-text-main dark:text-gray-300">Window Title</label>
                        </div>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none focus:border-primary text-sm"
                        />
                    </div>

                    <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-white/5">
                        <label className="flex items-center justify-between cursor-pointer group">
                             <span className="text-sm font-medium text-text-main dark:text-gray-300">Glassmorphism</span>
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isGlass}
                                    onChange={(e) => setIsGlass(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </div>
                        </label>

                        {isGlass && (
                            <div className="space-y-4 pl-2 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-text-sub">
                                        <span>Blur</span>
                                        <span>{glassBlur}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="40"
                                        value={glassBlur}
                                        onChange={(e) => setGlassBlur(Number(e.target.value))}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 accent-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs text-text-sub">
                                        <span>Opacity</span>
                                        <span>{Math.round(glassOpacity * 100)}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={glassOpacity * 100}
                                        onChange={(e) => setGlassOpacity(Number(e.target.value) / 100)}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 accent-primary"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toggles */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Components
                    </h3>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Window Controls</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={windowControls}
                                onChange={(e) => setWindowControls(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Line Numbers</span>
                         <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLineNumbers}
                                onChange={(e) => setShowLineNumbers(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </div>
                    </label>

                    {/* Dark Mode toggle for the Code Window itself, unrelated to app theme */}
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Dark Window</span>
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                        </div>
                    </label>


                </div>

                <button
                    onClick={handleDownload}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Download className="w-5 h-5" />
                    Download PNG
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/5 p-4 md:p-8 overflow-auto flex items-center justify-center relative min-h-[500px]">
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                    </div>

                    {/* The Export Container */}
                    <div
                        ref={exportRef}
                        className="transition-all duration-300 ease-in-out box-content"
                        style={{
                            background: (background.includes('url') || background.startsWith('data:'))
                                ? `url(${background}) center / cover no-repeat`
                                : background,
                            padding: `${paddingY}px ${paddingX}px`,
                            minWidth: '400px',
                            maxWidth: '100%'
                        }}
                    >
                        <div
                            className={clsx(
                                "rounded-xl shadow-2xl overflow-hidden transition-colors border",
                                darkMode
                                    ? "bg-[#2d2d2d] border-gray-700/50" // Match Prism Tomorrow bg
                                    : "bg-white border-gray-200"
                            )}
                            style={isGlass ? {
                                backgroundColor: darkMode 
                                    ? `rgba(45, 45, 45, ${glassOpacity})` 
                                    : `rgba(255, 255, 255, ${glassOpacity})`,
                                backdropFilter: `blur(${glassBlur}px)`,
                                WebkitBackdropFilter: `blur(${glassBlur}px)`,
                                borderColor: darkMode
                                    ? `rgba(255, 255, 255, 0.1)`
                                    : `rgba(0, 0, 0, 0.1)`
                            } : {}}
                        >
                            {/* Window Header */}
                            <div className={clsx(
                                "flex items-center px-4 py-3 border-b",
                                darkMode ? "border-white/5 bg-white/5" : "border-gray-100 bg-gray-50"
                            )}>
                                <div className="flex gap-2 w-[60px]">
                                    {windowControls && (
                                        <>
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                        </>
                                    )}
                                </div>
                                <div className={clsx(
                                    "flex-1 text-center text-xs font-medium font-mono opacity-60 truncate px-4",
                                    darkMode ? "text-white" : "text-gray-600"
                                )}>
                                    {title}
                                </div>
                                <div className="w-[60px]" /> {/* Spacer */}
                            </div>

                            {/* Code Editor Area */}
                            <div className={clsx(
                                "relative overflow-hidden font-mono text-[14px]",
                                darkMode ? "text-gray-200" : "text-gray-800"
                            )}>
                                {/* Editor takes up space, and we style it to look good */}
                                <div className="relative pl-1">
                                    {showLineNumbers && <LineNumbers />}
                                    <Editor
                                        value={code}
                                        onValueChange={setCode}
                                        highlight={highlight}
                                        padding={20}
                                        style={{
                                            fontFamily: '"Fira Code", "Fira Mono", monospace',
                                            fontSize: 14,
                                            lineHeight: '21px',
                                            backgroundColor: 'transparent',
                                            minHeight: '100px',
                                            marginLeft: showLineNumbers ? '24px' : '0',
                                        }}
                                        className={clsx(
                                            "min-w-full",
                                            // Prism theme overrides could go here if we weren't using the CSS file
                                        )}
                                        textareaClassName="focus:outline-none"
                                    />
                                </div>
                                {/* Watermark */}
                                <div className={clsx(
                                    "absolute bottom-2 right-4 text-[10px] font-bold tracking-widest opacity-30 select-none pointer-events-none",
                                    darkMode ? "text-white" : "text-black"
                                )}>
                                    NotYourAverage.Tools
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-4 text-xs text-text-sub">
                    Preview may differ slightly from export.
                </div>
            </div>
        </div>
    );
};
