"use client";

import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, Image as ImageIcon, Settings, RefreshCw, FileImage, CheckCircle, X } from 'lucide-react';

interface CompressedResult {
    file: File;
    url: string;
    originalSize: number;
    compressedSize: number;
}

export const ImageTool: React.FC = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [result, setResult] = useState<CompressedResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Settings
    const [quality, setQuality] = useState(0.8);
    const [maxWidth, setMaxWidth] = useState(1920);
    const [outputFormat, setOutputFormat] = useState('image/webp'); // 'image/webp', 'image/jpeg', 'image/png'

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            setOriginalFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please upload a valid image file.');
                return;
            }
            setOriginalFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleCompress = async () => {
        if (!originalFile) return;

        setIsCompressing(true);
        setError(null);

        try {
            const options = {
                maxSizeMB: 5, // Just a safeguard, quality controls mostly
                maxWidthOrHeight: maxWidth,
                useWebWorker: true,
                initialQuality: quality,
                fileType: outputFormat
            };

            const compressedFile = await imageCompression(originalFile, options);
            const compressedUrl = URL.createObjectURL(compressedFile);

            setResult({
                file: compressedFile,
                url: compressedUrl,
                originalSize: originalFile.size,
                compressedSize: compressedFile.size
            });

        } catch (err: any) {
            setError('Compression failed: ' + err.message);
        } finally {
            setIsCompressing(false);
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getSavings = (original: number, compressed: number) => {
        const saved = original - compressed;
        const percent = (saved / original) * 100;
        return {
            savedBytes: formatSize(saved),
            percent: Math.max(0, percent).toFixed(1)
        };
    };

    return (
        <div className="w-full flex flex-col xl:flex-row gap-8 items-start min-h-[600px]">

            {/* Left: Input & Settings */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">

                {/* Upload Zone */}
                <div
                    className={`relative group bg-white dark:bg-surface-dark rounded-3xl p-8 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center text-center gap-4 ${originalFile ? 'border-primary/50 bg-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20'}`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-4 rounded-full bg-gray-50 dark:bg-white/5 group-hover:scale-110 transition-transform">
                        <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white">
                            {originalFile ? 'Change Image' : 'Click or Drop Image'}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Supports JPG, PNG, WebP
                        </p>
                    </div>
                </div>

                {/* Settings Panel */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-white/5">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Compression Settings</span>
                    </div>

                    {/* Quality Slider */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Quality</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {Math.round(quality * 100)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Max Width */}
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Max Width</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {maxWidth}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="300"
                            max="3840"
                            step="100"
                            value={maxWidth}
                            onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Format Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-text-main dark:text-white">Output Format</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['image/webp', 'image/jpeg', 'image/png'].map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setOutputFormat(fmt)}
                                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-colors border ${outputFormat === fmt
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {fmt.split('/')[1].toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={handleCompress}
                        disabled={!originalFile || isCompressing}
                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${!originalFile || isCompressing
                                ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                                : 'bg-primary text-white hover:bg-primary-dark shadow-primary/25'
                            }`}
                    >
                        {isCompressing ? (
                            <>
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                Compressing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-5 h-5" />
                                Compress Image
                            </>
                        )}
                    </button>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 text-xs flex gap-2 items-start">
                            <X className="w-4 h-4 mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                </div>
            </div>

            {/* Right: Preview & Results */}
            <div className="flex-1 w-full flex flex-col gap-6">

                {/* Main Preview */}
                <div className="bg-black/5 dark:bg-black/20 rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center relative border border-gray-200 dark:border-white/5">
                    {/* Transparent grid background for transparency check */}
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat" />

                    {previewUrl ? (
                        <img
                            src={result ? result.url : previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-[600px] object-contain relative z-10 shadow-2xl"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-gray-400 relative z-10">
                            <ImageIcon className="w-16 h-16 opacity-20" />
                            <p>No image selected</p>
                        </div>
                    )}

                    {/* Badge Overlay */}
                    {result && (
                        <div className="absolute top-6 right-6 z-20 bg-green-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 animate-in fade-in zoom-in">
                            <CheckCircle className="w-4 h-4" />
                            Saved {getSavings(result.originalSize, result.compressedSize).percent}%
                        </div>
                    )}
                </div>

                {/* Result Stats Card */}
                {result && (
                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-bottom-4">
                        <div className="flex gap-8 text-center md:text-left">
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Original</div>
                                <div className="text-lg font-mono font-bold text-gray-500 line-through decoration-red-500/50">
                                    {formatSize(result.originalSize)}
                                </div>
                            </div>
                            <div className="w-px bg-gray-200 dark:bg-white/10" />
                            <div>
                                <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Compressed</div>
                                <div className="text-2xl font-mono font-black text-text-main dark:text-white">
                                    {formatSize(result.compressedSize)}
                                </div>
                            </div>
                        </div>

                        <a
                            href={result.url}
                            download={`compressed_${originalFile?.name.split('.')[0] || 'image'}.${outputFormat.split('/')[1]}`}
                            className="bg-text-main dark:bg-white text-white dark:text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-xl"
                        >
                            <Download className="w-5 h-5" />
                            Download
                        </a>
                    </div>
                )}
            </div>

        </div>
    );
};
