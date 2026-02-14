"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Download, RefreshCw, Copy, Check, Palette } from 'lucide-react';

interface GradientPoint {
    id: string;
    x: number;
    y: number;
    color: string;
}

const PRESET_PALETTES = [
    { name: 'Sunset', colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'] },
    { name: 'Ocean', colors: ['#0abde3', '#10ac84', '#00d2d3', '#5f27cd'] },
    { name: 'Aurora', colors: ['#a29bfe', '#74b9ff', '#55efc4', '#fd79a8'] },
    { name: 'Midnight', colors: ['#2d3436', '#636e72', '#b2bec3', '#dfe6e9'] },
    { name: 'Neon', colors: ['#f368e0', '#ff9f43', '#00d2d3', '#54a0ff'] },
];

const generateRandomColor = () => {
    // Generate vibrant colors using HSL then convert to hex
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
    const lightness = Math.floor(Math.random() * 30) + 50;  // 50-80%

    // Convert HSL to RGB then to Hex
    const s = saturation / 100;
    const l = lightness / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;
    if (hue < 60) { r = c; g = x; b = 0; }
    else if (hue < 120) { r = x; g = c; b = 0; }
    else if (hue < 180) { r = 0; g = c; b = x; }
    else if (hue < 240) { r = 0; g = x; b = c; }
    else if (hue < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const MeshTool: React.FC = () => {
    const [points, setPoints] = useState<GradientPoint[]>([
        { id: generateId(), x: 20, y: 20, color: '#ff6b6b' },
        { id: generateId(), x: 80, y: 20, color: '#feca57' },
        { id: generateId(), x: 20, y: 80, color: '#ff9ff3' },
        { id: generateId(), x: 80, y: 80, color: '#54a0ff' },
    ]);
    const [copied, setCopied] = useState(false);
    const [bgColor, setBgColor] = useState('#1a1a2e');
    const [blur, setBlur] = useState(80);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);

    // Drag handlers
    const handleMouseDown = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setDraggingId(id);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!draggingId || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        setPoints(prev => prev.map(p =>
            p.id === draggingId ? { ...p, x, y } : p
        ));
    }, [draggingId]);

    const handleMouseUp = useCallback(() => {
        setDraggingId(null);
    }, []);

    const generateCSS = useCallback(() => {
        const gradients = points.map(p =>
            `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color} 0%, transparent 50%)`
        ).join(',\n    ');

        return `background-color: ${bgColor};
background-image:
    ${gradients};
filter: blur(${blur}px);`;
    }, [points, bgColor, blur]);

    const copyCSS = () => {
        navigator.clipboard.writeText(generateCSS());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomize = () => {
        setPoints(points.map(p => ({
            ...p,
            x: Math.floor(Math.random() * 80) + 10,
            y: Math.floor(Math.random() * 80) + 10,
            color: generateRandomColor(),
        })));
        setBgColor(generateRandomColor());
    };

    const applyPalette = (colors: string[]) => {
        setPoints(points.map((p, i) => ({
            ...p,
            color: colors[i % colors.length],
        })));
    };

    const updatePoint = (id: string, updates: Partial<GradientPoint>) => {
        setPoints(points.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const addPoint = () => {
        setPoints([...points, {
            id: generateId(),
            x: 50,
            y: 50,
            color: generateRandomColor(),
        }]);
    };

    const removePoint = (id: string) => {
        if (points.length > 2) {
            setPoints(points.filter(p => p.id !== id));
        }
    };

    const downloadSVG = () => {
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    ${points.map((p, i) => `
    <radialGradient id="grad${i}" cx="${p.x}%" cy="${p.y}%" r="50%">
      <stop offset="0%" stop-color="${p.color}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${p.color}" stop-opacity="0"/>
    </radialGradient>`).join('')}
  </defs>
  <rect width="100%" height="100%" fill="${bgColor}"/>
  ${points.map((_, i) => `<rect width="100%" height="100%" fill="url(#grad${i})"/>`).join('\n  ')}
</svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mesh-gradient.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    const gradientStyle = {
        backgroundColor: bgColor,
        backgroundImage: points.map(p =>
            `radial-gradient(circle at ${p.x}% ${p.y}%, ${p.color} 0%, transparent 50%)`
        ).join(', '),
    };

    return (
        <div className="w-full space-y-6">
            {/* Preview */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl">
                <div
                    ref={canvasRef}
                    className="w-full aspect-[3/1] md:aspect-[2.5/1] relative select-none"
                    style={gradientStyle}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ filter: `blur(${blur}px)` }}
                    />

                    {/* Color Point Markers */}
                    {points.map((point) => (
                        <div
                            key={point.id}
                            className={`absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-white shadow-lg cursor-grab z-10 group transition-transform ${draggingId === point.id ? 'scale-125 cursor-grabbing' : 'hover:scale-110'}`}
                            style={{
                                left: `${point.x}%`,
                                top: `${point.y}%`,
                                backgroundColor: point.color,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                            }}
                            onMouseDown={handleMouseDown(point.id)}
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {point.x.toFixed(0)}%, {point.y.toFixed(0)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Color Points */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-text-main dark:text-white">Color Points</h3>
                        <button
                            onClick={addPoint}
                            className="text-xs font-bold text-primary hover:underline"
                        >
                            + Add Point
                        </button>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                        {points.map((point, index) => (
                            <div key={point.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                                <input
                                    type="color"
                                    value={point.color}
                                    onChange={(e) => updatePoint(point.id, { color: e.target.value })}
                                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                                />
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">X</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={point.x}
                                            onChange={(e) => updatePoint(point.id, { x: parseInt(e.target.value) })}
                                            className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase">Y</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={point.y}
                                            onChange={(e) => updatePoint(point.id, { y: parseInt(e.target.value) })}
                                            className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                    </div>
                                </div>
                                {points.length > 2 && (
                                    <button
                                        onClick={() => removePoint(point.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Settings */}
                <div className="space-y-4">
                    {/* Background & Blur */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-text-main dark:text-white mb-4">Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Background</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="w-12 h-10 rounded-lg cursor-pointer border-0"
                                    />
                                    <input
                                        type="text"
                                        value={bgColor}
                                        onChange={(e) => setBgColor(e.target.value)}
                                        className="flex-1 bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-2 text-sm font-mono text-text-main dark:text-white border border-gray-200 dark:border-white/10"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 flex justify-between">
                                    <span>Blur</span>
                                    <span className="text-primary">{blur}px</span>
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="150"
                                    value={blur}
                                    onChange={(e) => setBlur(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Presets
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_PALETTES.map((palette) => (
                                <button
                                    key={palette.name}
                                    onClick={() => applyPalette(palette.colors)}
                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-black/20 rounded-lg hover:bg-gray-100 dark:hover:bg-black/40 transition-colors"
                                >
                                    <div className="flex -space-x-1">
                                        {palette.colors.slice(0, 4).map((c, i) => (
                                            <div
                                                key={i}
                                                className="w-4 h-4 rounded-full border border-white"
                                                style={{ backgroundColor: c }}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-text-main dark:text-white">{palette.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={randomize}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Randomize
                </button>
                <button
                    onClick={copyCSS}
                    className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy CSS'}
                </button>
                <button
                    onClick={downloadSVG}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Download SVG
                </button>
            </div>

            {/* CSS Output */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-gray-400 uppercase">Generated CSS</span>
                </div>
                <pre className="text-sm text-green-400 font-mono overflow-x-auto whitespace-pre-wrap">
                    {generateCSS()}
                </pre>
            </div>
        </div>
    );
};
