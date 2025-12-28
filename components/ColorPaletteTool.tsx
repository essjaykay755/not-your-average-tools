"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Copy, Check, RefreshCw, Palette, Download } from 'lucide-react';

interface ColorInfo {
    hex: string;
    rgb: { r: number; g: number; b: number };
    count: number;
}

const rgbToHex = (r: number, g: number, b: number): string =>
    '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

const getColorDistance = (c1: number[], c2: number[]): number =>
    Math.sqrt(Math.pow(c1[0] - c2[0], 2) + Math.pow(c1[1] - c2[1], 2) + Math.pow(c1[2] - c2[2], 2));

// K-means clustering for color extraction
const extractColors = (imageData: ImageData, numColors: number = 6): ColorInfo[] => {
    const { data, width, height } = imageData;
    const pixels: number[][] = [];

    // Sample pixels (every 4th pixel for performance)
    for (let i = 0; i < data.length; i += 16) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a > 200) pixels.push([r, g, b]);
    }

    if (pixels.length === 0) return [];

    // Initialize centroids randomly
    let centroids: number[][] = [];
    for (let i = 0; i < numColors; i++) {
        centroids.push([...pixels[Math.floor(Math.random() * pixels.length)]]);
    }

    // K-means iterations
    for (let iter = 0; iter < 10; iter++) {
        const clusters: number[][][] = Array.from({ length: numColors }, () => []);

        // Assign pixels to clusters
        for (const pixel of pixels) {
            let minDist = Infinity, minIdx = 0;
            for (let i = 0; i < centroids.length; i++) {
                const dist = getColorDistance(pixel, centroids[i]);
                if (dist < minDist) { minDist = dist; minIdx = i; }
            }
            clusters[minIdx].push(pixel);
        }

        // Update centroids
        for (let i = 0; i < numColors; i++) {
            if (clusters[i].length > 0) {
                centroids[i] = [
                    Math.round(clusters[i].reduce((s, p) => s + p[0], 0) / clusters[i].length),
                    Math.round(clusters[i].reduce((s, p) => s + p[1], 0) / clusters[i].length),
                    Math.round(clusters[i].reduce((s, p) => s + p[2], 0) / clusters[i].length),
                ];
            }
        }
    }

    // Count and sort by frequency
    const colorCounts = centroids.map((c, i) => ({ centroid: c, count: 0 }));
    for (const pixel of pixels) {
        let minDist = Infinity, minIdx = 0;
        for (let i = 0; i < centroids.length; i++) {
            const dist = getColorDistance(pixel, centroids[i]);
            if (dist < minDist) { minDist = dist; minIdx = i; }
        }
        colorCounts[minIdx].count++;
    }

    return colorCounts
        .filter(c => c.count > 0)
        .sort((a, b) => b.count - a.count)
        .map(c => ({
            hex: rgbToHex(c.centroid[0], c.centroid[1], c.centroid[2]),
            rgb: { r: c.centroid[0], g: c.centroid[1], b: c.centroid[2] },
            count: c.count,
        }));
};

export const ColorPaletteTool: React.FC = () => {
    const [colors, setColors] = useState<ColorInfo[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [numColors, setNumColors] = useState(6);
    const [copiedColor, setCopiedColor] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const processImage = useCallback((img: HTMLImageElement) => {
        setIsProcessing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const extractedColors = extractColors(imageData, numColors);
        setColors(extractedColors);
        setIsProcessing(false);
    }, [numColors]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setImagePreview(dataUrl);

            const img = new Image();
            img.onload = () => processImage(img);
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setImagePreview(dataUrl);
                const img = new Image();
                img.onload = () => processImage(img);
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    };

    const regenerate = () => {
        if (imagePreview) {
            const img = new Image();
            img.onload = () => processImage(img);
            img.src = imagePreview;
        }
    };

    const copyColor = async (hex: string) => {
        await navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const exportPalette = () => {
        const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
        const blob = new Blob([`:root {\n${css}\n}`], { type: 'text/css' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'palette.css'; a.click();
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6">
            <canvas ref={canvasRef} className="hidden" />

            {/* Left Panel */}
            <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative aspect-square rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group bg-gray-50 dark:bg-white/5"
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <div className="p-6 rounded-full bg-gray-100 dark:bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-text-main dark:text-white">Drop image here</p>
                                <p className="text-sm">or click to browse</p>
                            </div>
                        </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-text-main dark:text-white mb-3">Colors to Extract: {numColors}</label>
                        <input type="range" min="3" max="12" value={numColors} onChange={(e) => setNumColors(Number(e.target.value))} className="w-full accent-primary" />
                    </div>
                    <button onClick={regenerate} disabled={!imagePreview || isProcessing} className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                        <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} /> Re-extract
                    </button>
                </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main dark:text-white flex items-center gap-2">
                        <Palette className="w-5 h-5 text-primary" /> Extracted Palette
                    </h3>
                    {colors.length > 0 && (
                        <button onClick={exportPalette} className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" /> Export CSS
                        </button>
                    )}
                </div>

                {colors.length > 0 ? (
                    <>
                        {/* Palette Bar */}
                        <div className="h-24 rounded-2xl overflow-hidden flex shadow-lg">
                            {colors.map((color, i) => (
                                <div key={i} className="flex-1 cursor-pointer hover:flex-[1.5] transition-all duration-300 group relative" style={{ backgroundColor: color.hex }} onClick={() => copyColor(color.hex)}>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                        {copiedColor === color.hex ? <Check className="w-6 h-6 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Color Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {colors.map((color, i) => (
                                <div key={i} onClick={() => copyColor(color.hex)} className="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 cursor-pointer hover:shadow-lg transition-all">
                                    <div className="h-20" style={{ backgroundColor: color.hex }} />
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-text-main dark:text-white">{color.hex.toUpperCase()}</span>
                                            {copiedColor === color.hex ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400 group-hover:text-primary" />}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20">
                        <Palette className="w-12 h-12 opacity-20 mb-4" />
                        <p>Upload an image to extract its color palette</p>
                    </div>
                )}
            </div>
        </div>
    );
};
