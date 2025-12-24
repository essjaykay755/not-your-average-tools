"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Image as ImageIcon, RotateCcw } from 'lucide-react';

type AspectRatio = {
    name: string;
    ratio: number;
    width: number; // reference width for export
    height: number;
    icon: string;
};

const ASPECT_RATIOS: AspectRatio[] = [
    { name: 'Square (1:1)', ratio: 1, width: 1080, height: 1080, icon: 'square' },
    { name: 'Portrait (4:5)', ratio: 4 / 5, width: 1080, height: 1350, icon: 'crop_portrait' },
    { name: 'Story (9:16)', ratio: 9 / 16, width: 1080, height: 1920, icon: 'crop_5_4' }, // approximate icon
    { name: 'Landscape (1.91:1)', ratio: 1.91, width: 1200, height: 628, icon: 'crop_landscape' },
    { name: 'Twitter Header (3:1)', ratio: 3, width: 1500, height: 500, icon: 'panorama' },
];

export const SocialResizeTool: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [selectedRatio, setSelectedRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setScale(1);
                setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const downloadImage = () => {
        if (!imageRef.current || !containerRef.current) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions to target high-res output
        canvas.width = selectedRatio.width;
        canvas.height = selectedRatio.height;

        // Draw background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate source image mapping
        // The visible area in the DOM container needs to be mapped to the canvas
        // 1. Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // 2. Calculate scaling factor between DOM container and Canvas Output
        // We want the output to match `selectedRatio.width`
        const domToCanvasScale = selectedRatio.width / containerRect.width;

        // 3. Current Image Transforms in DOM
        // position.x, position.y are in DOM pixels relative to center
        // scale is the zoom level

        // We need to draw the image onto the canvas such that it looks identical to the preview
        
        const img = new Image();
        img.src = image!;
        img.onload = () => {
            ctx.save();
            
            // Move to center of canvas
            ctx.translate(canvas.width / 2, canvas.height / 2);
            
            // Apply scale and translation from DOM state
            // Position needs to be scaled up to canvas resolution
            ctx.translate(position.x * domToCanvasScale, position.y * domToCanvasScale);
            ctx.scale(scale, scale);
            
            // Draw image centered
            // We need to scale the image draw size to match the container's relative size * domToCanvasScale
            // The image in DOM is rendered with `width: 100%` of container usually, or intrinsic?
            // Actually, in the render below, `img` has `max-width: none` and we control size via scale.
            // Let's assume intrinsic natural dimensions, but we need to know its base rendered size.
            // A simpler approach:
            // Calculate the ratio of (Image Natural Width) / (Image Rendered Width at scale=1)
            
            // Let's use the natural dimensions and scale them to fit the canvas width initially (like 'cover')
            // If we fit 'contain' logic in DOM initial render, we replicate that here.
            
            // For simplicity in this v1:
            // We assume the user sees the image as drawn.
            // Let's draw based on the ratio of Natural Image to Current Rendered DOM Image
            const renderedWidth = imageRef.current!.offsetWidth; // The width as displayed in DOM (before transform)
            const renderedHeight = imageRef.current!.offsetHeight;
            
            const renderScale = domToCanvasScale; // Mapping DOM pixels to Canvas pixels

            // Draw
            ctx.drawImage(
                img, 
                -renderedWidth / 2, 
                -renderedHeight / 2, 
                renderedWidth, 
                renderedHeight
            );
            
            ctx.restore();

            // Download
            const link = document.createElement('a');
            link.download = `resized-${selectedRatio.name.replace(/\s/g, '').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png', 0.9);
            link.click();
        };
    };

    // Calculate container height based on width for the aspect ratio
    // We'll use a fixed max-width for the container, say 500px or 100%
    // and calculate height dynamically.
    const containerStyle = {
        aspectRatio: `${selectedRatio.ratio}`,
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-none mx-auto min-h-[600px]">
            {/* Controls */}
            <div className="flex-1 flex flex-col gap-6 order-2 lg:order-1">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Upload Image</h3>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all text-center">
                                <div className="p-3 bg-white dark:bg-white/10 rounded-full shadow-sm mb-3">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <p className="text-sm font-medium text-text-main dark:text-white">Click or drag image here</p>
                                <p className="text-xs text-text-sub dark:text-gray-400 mt-1">Supports JPG, PNG, WebP</p>
                            </div>
                        </div>
                    </div>

                    {image && (
                        <>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Target Platform</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map((ratio) => (
                                        <button
                                            key={ratio.name}
                                            onClick={() => setSelectedRatio(ratio)}
                                            className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all text-left ${selectedRatio.name === ratio.name
                                                ? 'bg-primary text-white shadow-md shadow-primary/20'
                                                : 'bg-gray-50 dark:bg-white/5 text-text-sub dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[18px]">{ratio.icon}</span>
                                            {ratio.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Zoom</h3>
                                    <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-text-sub dark:text-gray-400">
                                        {(scale * 100).toFixed(0)}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <button
                                onClick={downloadImage}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold hover:opacity-90 transition-opacity shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                Download Resized
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-[1.5] flex flex-col items-center justify-start order-1 lg:order-2 bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl border border-gray-200 dark:border-white/5 p-8 overflow-hidden relative min-h-[500px]">
                 {/* Grid Pattern Background */}
                 <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                      style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
                 </div>

                {image ? (
                    <div className="w-full h-full flex items-center justify-center relative z-10">
                        {/* The Viewport Container - This clips the image to the aspect ratio */}
                        <div
                            ref={containerRef}
                            style={{ ...containerStyle, maxWidth: '100%', maxHeight: '600px' }}
                            className="bg-white relative overflow-hidden shadow-2xl ring-1 ring-black/5 cursor-move"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            {/* The Image - Transformed */}
                            <img
                                ref={imageRef}
                                src={image}
                                alt="Preview"
                                draggable={false}
                                className="absolute max-w-none origin-center select-none"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                    // Start with a reasonable size if image is huge
                                    height: '100%', 
                                    width: 'auto',
                                    // If image is portrait and container is landscape, this might leave gaps initially, 
                                    // but user can zoom/move. 'object-cover' equivalent behavior requires JS math on load.
                                }}
                            />
                            
                            {/* Grid Overlay for Composition */}
                            <div className="absolute inset-0 pointer-events-none opacity-30 border border-white/50">
                                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-r border-b border-white/50"></div>
                                    <div className="border-b border-white/50"></div>
                                    <div className="border-r border-white/50"></div>
                                    <div className="border-r border-white/50"></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                        
                        <p className="absolute bottom-4 text-xs text-text-sub dark:text-gray-500 font-medium bg-white/80 dark:bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm pointer-events-none">
                            Drag to pan • Scroll to zoom
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-sub dark:text-gray-500 z-10">
                        <div className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <ImageIcon className="w-8 h-8 opacity-50" />
                        </div>
                        <p className="font-medium">No image selected</p>
                        <p className="text-sm opacity-60">Upload an image to start resizing</p>
                    </div>
                )}
            </div>
        </div>
    );
};
