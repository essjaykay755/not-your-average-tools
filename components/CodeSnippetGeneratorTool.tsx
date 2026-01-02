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
import 'prismjs/themes/prism-tomorrow.css'; // Default theme
import { toPng } from 'html-to-image';
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
    // Gradients
    { name: 'Gradient 1', value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { name: 'Gradient 2', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { name: 'Gradient 3', value: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
    { name: 'Gradient 4', value: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)' },
    // Dark Gradients
    { name: 'Dark 1', value: 'linear-gradient(to right, #434343 0%, #000000 100%)' },
    { name: 'Dark 2', value: 'linear-gradient(to right, #09203f 0%, #537895 100%)' },
    { name: 'Purple', value: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' },
    { name: 'Candy', value: 'linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)' },
    // Mesh / Abstract (CSS Approximation of "MacBook" vibes)
    { name: 'Big Sur', value: 'linear-gradient(to bottom, #dbeafe 0%, #93c5fd 20%, #60a5fa 40%, #2563eb 60%, #1e40af 80%, #0f172a 100%)' },  // Simplified vertical
    { name: 'Monterey', value: 'linear-gradient(to bottom, #fbc2eb 0%, #a6c1ee 100%)' },
    { name: 'Abstract 1', value: 'conic-gradient(from 90deg at 50% 50%, #E2E2E2 0%, #C9D6FF 50%, #E2E2E2 100%)' },
    { name: 'Abstract 2', value: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #000000 100%)' },
    { name: 'Mesh 1', value: 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)' },
    { name: 'Mesh 2', value: 'radial-gradient(at 40% 20%, hsla(28,100%,74%,1) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,1) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,1) 0, transparent 50%)' },
    { name: 'Mesh 3', value: 'radial-gradient(at 0% 0%, hsla(192,100%,50%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(280,100%,50%,1) 0, transparent 50%)' },
    // Solids
    { name: 'Solid Gray', value: '#1e293b' },
    { name: 'Solid Black', value: '#000000' },
    { name: 'Transparent', value: 'transparent' },
];

const PADDINGS = [16, 32, 64, 96];

export const CodeSnippetGeneratorTool: React.FC = () => {
    const [code, setCode] = useState(`const greet = (name: string) => {
  console.log(\`Hello, \${name}!\`);
};

greet('World');`);
    const [language, setLanguage] = useState('typescript');
    const [background, setBackground] = useState(BACKGROUNDS[6].value); // Default nice purple
    const [customBg, setCustomBg] = useState<string | null>(null);
    const [windowControls, setWindowControls] = useState(true);
    const [darkMode, setDarkMode] = useState(true); // Inner window theme
    const [padding, setPadding] = useState(64);
    const [title, setTitle] = useState('Untitled-1');
    const [showLineNumbers, setShowLineNumbers] = useState(true);

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
            const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `snippet-${new Date().getTime()}.png`;
            link.href = dataUrl;
            link.click();
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
            {/* Controls Side */}
            <div className="xl:w-[350px] flex flex-col gap-6 order-2 xl:order-1 h-fit">
                {/* Visual Settings */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-5 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Appearance
                    </h3>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">Language</label>
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

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">Background</label>
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

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-text-main dark:text-gray-300">Padding</label>
                        <div className="flex bg-gray-50 dark:bg-white/5 rounded-lg p-1">
                            {PADDINGS.map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPadding(p)}
                                    className={clsx(
                                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-colors",
                                        padding === p ? "bg-white dark:bg-white/10 shadow text-primary" : "text-text-sub hover:text-text-main"
                                    )}
                                >
                                    {p}px
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
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
                </div>

                {/* Toggles */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-5 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                        <Layout className="w-4 h-4" /> Components
                    </h3>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Window Controls</span>
                        <input
                            type="checkbox"
                            checked={windowControls}
                            onChange={(e) => setWindowControls(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Line Numbers</span>
                        <input
                            type="checkbox"
                            checked={showLineNumbers}
                            onChange={(e) => setShowLineNumbers(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
                    </label>

                    {/* Dark Mode toggle for the Code Window itself, unrelated to app theme */}
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-sm font-medium text-text-main dark:text-gray-300">Dark Window</span>
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className="w-5 h-5 accent-primary"
                        />
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
                                ? `url(${background}) center / 100% 100% no-repeat`
                                : background,
                            padding: `${padding}px`,
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
