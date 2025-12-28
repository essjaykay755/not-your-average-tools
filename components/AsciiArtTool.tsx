"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Copy, Check, RefreshCw, Type, ImageIcon } from 'lucide-react';

const ASCII_CHARS = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.', ' '];
const ASCII_CHARS_DETAILED = ['$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', "'", '.', ' '];

export const AsciiArtTool: React.FC = () => {
    const [asciiArt, setAsciiArt] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [width, setWidth] = useState(100);
    const [useDetailedChars, setUseDetailedChars] = useState(false);
    const [inverted, setInverted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const convertToAscii = useCallback((imageData: ImageData, outputWidth: number) => {
        const chars = useDetailedChars ? ASCII_CHARS_DETAILED : ASCII_CHARS;
        const charCount = chars.length;

        const { width: imgWidth, height: imgHeight, data } = imageData;
        const aspectRatio = imgHeight / imgWidth;
        const outputHeight = Math.floor(outputWidth * aspectRatio * 0.5); // 0.5 for character aspect ratio

        const blockWidth = imgWidth / outputWidth;
        const blockHeight = imgHeight / outputHeight;

        let result = '';

        for (let y = 0; y < outputHeight; y++) {
            for (let x = 0; x < outputWidth; x++) {
                const startX = Math.floor(x * blockWidth);
                const startY = Math.floor(y * blockHeight);
                const endX = Math.floor((x + 1) * blockWidth);
                const endY = Math.floor((y + 1) * blockHeight);

                let totalBrightness = 0;
                let pixelCount = 0;

                for (let py = startY; py < endY && py < imgHeight; py++) {
                    for (let px = startX; px < endX && px < imgWidth; px++) {
                        const idx = (py * imgWidth + px) * 4;
                        const r = data[idx];
                        const g = data[idx + 1];
                        const b = data[idx + 2];
                        const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
                        totalBrightness += brightness;
                        pixelCount++;
                    }
                }

                let avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 0;
                if (inverted) avgBrightness = 255 - avgBrightness;

                const charIndex = Math.floor((avgBrightness / 255) * (charCount - 1));
                result += chars[charIndex];
            }
            result += '\n';
        }

        return result;
    }, [useDetailedChars, inverted]);

    const processImage = useCallback((img: HTMLImageElement) => {
        setIsProcessing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const ascii = convertToAscii(imageData, width);
        setAsciiArt(ascii);
        setIsProcessing(false);
    }, [convertToAscii, width]);

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

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(asciiArt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadAsTxt = () => {
        const blob = new Blob([asciiArt], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ascii-art.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-6">
            <canvas ref={canvasRef} className="hidden" />

            {/* Left Panel - Upload & Controls */}
            <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
                {/* Upload Area */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="relative aspect-square rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden group bg-gray-50 dark:bg-white/5"
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
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
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Controls */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-text-main dark:text-white mb-3">
                            Output Width: {width} chars
                        </label>
                        <input
                            type="range"
                            min="40"
                            max="200"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            className="w-full accent-primary"
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={useDetailedChars}
                                onChange={(e) => setUseDetailedChars(e.target.checked)}
                                className="w-5 h-5 rounded accent-primary"
                            />
                            <span className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                                Use detailed character set
                            </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={inverted}
                                onChange={(e) => setInverted(e.target.checked)}
                                className="w-5 h-5 rounded accent-primary"
                            />
                            <span className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                                Invert colors
                            </span>
                        </label>
                    </div>

                    <button
                        onClick={regenerate}
                        disabled={!imagePreview || isProcessing}
                        className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
                        Regenerate
                    </button>
                </div>
            </div>

            {/* Right Panel - ASCII Output */}
            <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-text-main dark:text-white flex items-center gap-2">
                        <Type className="w-5 h-5 text-primary" />
                        ASCII Output
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={copyToClipboard}
                            disabled={!asciiArt}
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-text-main dark:text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                            onClick={downloadAsTxt}
                            disabled={!asciiArt}
                            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-[#1e1e1e] rounded-3xl p-6 overflow-auto border border-gray-800">
                    {asciiArt ? (
                        <pre className="font-mono text-[6px] sm:text-[8px] md:text-[10px] leading-none text-green-400 whitespace-pre select-all">
                            {asciiArt}
                        </pre>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 gap-4">
                            <ImageIcon className="w-12 h-12 opacity-20" />
                            <p>Upload an image to generate ASCII art</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
