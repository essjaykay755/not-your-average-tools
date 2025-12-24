"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, Loader2, RefreshCw, Sparkles, ImageIcon } from 'lucide-react';

// Type definitions for MediaPipe
interface ImageSegmenterResult {
    categoryMask: {
        getAsUint8Array: () => Uint8Array;
        close: () => void;
    } | null;
    close: () => void;
}

export const PortraitTool: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isModelLoading, setIsModelLoading] = useState(false);
    const [blurAmount, setBlurAmount] = useState(15);
    const [error, setError] = useState<string | null>(null);
    const [segmenter, setSegmenter] = useState<any>(null);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load MediaPipe
    useEffect(() => {
        const loadMediaPipe = async () => {
            if (segmenter) return;

            setIsModelLoading(true);
            setError(null);

            try {
                // Dynamically import MediaPipe tasks-vision
                const vision = await import('@mediapipe/tasks-vision');

                const { ImageSegmenter, FilesetResolver } = vision;

                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
                );

                const imageSegmenter = await ImageSegmenter.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/deeplab_v3/float32/latest/deeplab_v3.tflite",
                        delegate: "GPU"
                    },
                    runningMode: "IMAGE",
                    outputCategoryMask: false,
                    outputConfidenceMasks: true
                });

                setSegmenter(imageSegmenter);
                setIsModelLoading(false);
            } catch (err) {
                console.error('Failed to load MediaPipe:', err);
                setError('Failed to load AI model. This browser may not support WebGPU/WebGL.');
                setIsModelLoading(false);
            }
        };

        loadMediaPipe();
    }, []);

    const processImage = useCallback(async (imageElement: HTMLImageElement) => {
        if (!segmenter || !canvasRef.current) return;

        setIsProcessing(true);
        setError(null);

        try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d')!;

            // Set canvas size to match image
            canvas.width = imageElement.naturalWidth;
            canvas.height = imageElement.naturalHeight;

            // Draw original image
            ctx.drawImage(imageElement, 0, 0);

            // Run segmentation
            const result = segmenter.segment(imageElement);

            // Get confidence masks (DeepLabV3 returns one mask per class, class 15 = person)
            const confidenceMasks = result.confidenceMasks;

            if (!confidenceMasks || confidenceMasks.length === 0) {
                throw new Error('No segmentation mask generated');
            }

            // DeepLabV3 class 15 = person. If not enough classes, fallback to last mask.
            const personClassIndex = Math.min(15, confidenceMasks.length - 1);
            const personMask = confidenceMasks[personClassIndex];
            const maskData = personMask.getAsFloat32Array();
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            // Create blurred version
            const blurCanvas = document.createElement('canvas');
            blurCanvas.width = canvas.width;
            blurCanvas.height = canvas.height;
            const blurCtx = blurCanvas.getContext('2d')!;
            blurCtx.filter = `blur(${blurAmount}px)`;
            blurCtx.drawImage(imageElement, 0, 0);
            const blurredData = blurCtx.getImageData(0, 0, canvas.width, canvas.height);

            // Composite using smooth alpha blending for soft edges
            const outputData = ctx.createImageData(canvas.width, canvas.height);

            for (let i = 0; i < maskData.length; i++) {
                const pixelIndex = i * 4;
                // Confidence value from selfie segmenter: higher = person
                // Use directly: high confidence = use original (person), low = use blurred (background)
                const personConfidence = maskData[i];

                // Smooth alpha blend between original (person) and blurred (background)
                outputData.data[pixelIndex] = imageData.data[pixelIndex] * personConfidence + blurredData.data[pixelIndex] * (1 - personConfidence);
                outputData.data[pixelIndex + 1] = imageData.data[pixelIndex + 1] * personConfidence + blurredData.data[pixelIndex + 1] * (1 - personConfidence);
                outputData.data[pixelIndex + 2] = imageData.data[pixelIndex + 2] * personConfidence + blurredData.data[pixelIndex + 2] * (1 - personConfidence);
                outputData.data[pixelIndex + 3] = 255;
            }

            ctx.putImageData(outputData, 0, 0);

            // Convert to data URL
            setProcessedImage(canvas.toDataURL('image/png'));

            // Clean up
            personMask.close();
            result.close();
        } catch (err) {
            console.error('Processing error:', err);
            setError('Failed to process image. Try a different photo.');
        } finally {
            setIsProcessing(false);
        }
    }, [segmenter, blurAmount]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImageLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setOriginalImage(dataUrl);
            setProcessedImage(null);

            // Process automatically
            const img = new Image();
            img.onload = () => {
                setIsImageLoading(false);
                processImage(img);
            };
            img.onerror = () => {
                setIsImageLoading(false);
                setError('Failed to load image.');
            };
            img.src = dataUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setIsImageLoading(true);
            setError(null);

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                setOriginalImage(dataUrl);
                setProcessedImage(null);

                const img = new Image();
                img.onload = () => {
                    setIsImageLoading(false);
                    processImage(img);
                };
                img.onerror = () => {
                    setIsImageLoading(false);
                    setError('Failed to load image.');
                };
                img.src = dataUrl;
            };
            reader.readAsDataURL(file);
        }
    };

    const reprocess = () => {
        if (originalImage) {
            const img = new Image();
            img.onload = () => processImage(img);
            img.src = originalImage;
        }
    };

    const downloadImage = () => {
        if (!processedImage) return;
        const a = document.createElement('a');
        a.href = processedImage;
        a.download = 'portrait-mode.png';
        a.click();
    };

    return (
        <div className="w-full space-y-6">
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Model Loading State */}
            {isModelLoading && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center gap-4">
                    <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
                    <div>
                        <h3 className="font-bold text-blue-800 dark:text-blue-200">Loading AI Model</h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                            Downloading DeepLabV3 segmentation model (~2.5MB)... This only happens once.
                        </p>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            )}

            {/* Image Loading State */}
            {isImageLoading && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-4 flex items-center gap-4">
                    <Loader2 className="w-6 h-6 text-purple-600 dark:text-purple-400 animate-spin" />
                    <div>
                        <h3 className="font-bold text-purple-800 dark:text-purple-200">Loading Image</h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            Reading your photo and preparing for AI processing...
                        </p>
                    </div>
                </div>
            )}

            {/* Upload Area */}
            {!originalImage && !isImageLoading && (
                <div
                    className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">
                        Upload a Portrait Photo
                    </h3>
                    <p className="text-sm text-gray-400">
                        Drag and drop or click to select. Works best with clear portraits.
                    </p>
                </div>
            )}

            {/* Image Preview */}
            {originalImage && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Original</h3>
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-black/20">
                            <img
                                src={originalImage}
                                alt="Original"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Processed */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Portrait Mode
                        </h3>
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-black/20">
                            {isProcessing ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : processedImage ? (
                                <img
                                    src={processedImage}
                                    alt="Portrait Mode"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            {originalImage && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <div className="flex flex-col md:flex-row gap-6 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between">
                                <span>Background Blur</span>
                                <span className="text-primary">{blurAmount}px</span>
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="40"
                                value={blurAmount}
                                onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button
                                onClick={reprocess}
                                disabled={isProcessing || isModelLoading}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                                Apply
                            </button>

                            <button
                                onClick={downloadImage}
                                disabled={!processedImage}
                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Image Button */}
            {originalImage && (
                <button
                    onClick={() => {
                        setOriginalImage(null);
                        setProcessedImage(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="w-full py-3 text-center text-sm font-medium text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                >
                    ← Upload a different photo
                </button>
            )}

            {/* Info */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-3">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Uses DeepLabV3, a high-accuracy semantic segmentation AI model from MediaPipe
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        21-class recognition with smooth alpha blending for natural-looking edges
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        All processing happens locally in your browser — your photos never leave your device
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Works best with clear portraits where the subject is fully visible
                    </li>
                </ul>
            </div>
        </div>
    );
};
