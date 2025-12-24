"use client";

import React, { useState, useRef } from 'react';
import { Upload, Download, FileImage, Check, AlertCircle } from 'lucide-react';

const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

export const IcoConverterTool: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 48]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setDownloadUrl(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleSize = (size: number) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const generateIco = async () => {
        if (!image || selectedSizes.length === 0) return;

        setIsGenerating(true);
        try {
            const img = new Image();
            img.src = image;
            await new Promise((resolve) => { img.onload = resolve; });

            // ICO Header: 6 bytes
            // 0-1: Reserved (0)
            // 2-3: Type (1 for ICO)
            // 4-5: Number of images
            const numImages = selectedSizes.length;
            const header = new Uint8Array([0, 0, 1, 0, numImages & 255, (numImages >> 8) & 255]);

            const imageDirectories: Uint8Array[] = [];
            const imageDataArray: Uint8Array[] = [];
            let offset = 6 + (16 * numImages); // Header + (16 bytes * num images)

            for (const size of selectedSizes) {
                // Resize image to canvas
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) continue;
                
                ctx.drawImage(img, 0, 0, size, size);
                
                // Get PNG blob
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (!blob) continue;

                const buffer = await blob.arrayBuffer();
                const data = new Uint8Array(buffer);
                imageDataArray.push(data);

                // Directory Entry: 16 bytes
                // 0: Width (0 means 256)
                // 1: Height (0 means 256)
                // 2: Color Palette count (0)
                // 3: Reserved (0)
                // 4-5: Color Planes (1)
                // 6-7: Bits per pixel (32)
                // 8-11: Size of image data in bytes
                // 12-15: Offset of image data
                const dir = new Uint8Array(16);
                dir[0] = size === 256 ? 0 : size;
                dir[1] = size === 256 ? 0 : size;
                dir[2] = 0;
                dir[3] = 0;
                dir[4] = 1; dir[5] = 0; // Planes
                dir[6] = 32; dir[7] = 0; // BPP
                
                // Size
                dir[8] = data.length & 255;
                dir[9] = (data.length >> 8) & 255;
                dir[10] = (data.length >> 16) & 255;
                dir[11] = (data.length >> 24) & 255;

                // Offset
                dir[12] = offset & 255;
                dir[13] = (offset >> 8) & 255;
                dir[14] = (offset >> 16) & 255;
                dir[15] = (offset >> 24) & 255;

                imageDirectories.push(dir);
                offset += data.length;
            }

            // Combine all parts
            const finalBlob = new Blob([header, ...imageDirectories, ...imageDataArray] as BlobPart[], { type: 'image/x-icon' });
            const url = URL.createObjectURL(finalBlob);
            setDownloadUrl(url);

        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12">
            {/* Input Section (Upload + Settings + Preview) */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 md:p-12">
                <div className={`grid grid-cols-1 ${image ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-12 transition-all duration-500 ease-in-out`}>
                    
                    {/* Column 1: Upload */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">1. Upload Image</h3>
                        <div className="relative group h-full">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                                <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gray-50 dark:bg-white/5 group-hover:border-primary/50 group-hover:bg-primary/5 transition-all text-center h-full min-h-[320px] ${image ? 'cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800/30' : 'py-24'}`}
                                     onClick={(e) => {
                                         if (image) {
                                             e.preventDefault();
                                             setImage(null);
                                             setDownloadUrl(null);
                                             // Reset file input if needed by accessing ref, but simple state clear works for UI
                                         }
                                     }}
                                >
                                    {image ? (
                                        <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                             <div className="p-4 bg-white dark:bg-white/10 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform inline-block">
                                                <Upload className="w-8 h-8 text-primary" />
                                             </div>
                                             <div>
                                                <p className="text-sm font-bold text-text-main dark:text-white group-hover:text-red-500 transition-colors">Click to Change Image</p>
                                                <p className="text-xs text-text-sub dark:text-gray-400 group-hover:text-red-400/70">Returns to upload view</p>
                                             </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="p-4 bg-white dark:bg-white/10 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform inline-block">
                                                <Upload className="w-8 h-8 text-primary" />
                                            </div>
                                            <p className="text-lg font-bold text-text-main dark:text-white">Click or drag image here</p>
                                            <p className="text-sm text-text-sub dark:text-gray-400 mt-2">PNG, JPG, WebP supported</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columns 2 & 3: Settings & Preview (Visible only when image selected) */}
                        {image && (
                            <>
                                {/* Column 2: Settings */}
                                <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-500">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">2. Select Sizes</h3>
                                    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 p-8 h-full flex flex-col justify-between min-h-[320px]">
                                        <div className="space-y-4">
                                            <p className="text-sm text-text-sub dark:text-gray-400 mb-2">Choose sizes to include in the icon file:</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                {SIZES.map(size => (
                                                    <button
                                                        key={size}
                                                        onClick={() => toggleSize(size)}
                                                        className={`py-4 px-4 rounded-xl text-sm font-semibold border-2 transition-all flex items-center justify-center gap-2 ${
                                                            selectedSizes.includes(size)
                                                            ? 'bg-white dark:bg-white/10 border-primary text-primary shadow-sm'
                                                            : 'bg-transparent border-gray-200 dark:border-white/10 hover:bg-white/50 dark:hover:bg-white/5 text-gray-500'
                                                        }`}
                                                    >
                                                        <span>{size}x{size}</span>
                                                        {selectedSizes.includes(size) && <Check className="w-4 h-4" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Spacer to push content up if needed, or just let it naturally sit */}
                                        <div className="flex-1"></div>
                                    </div>
                                </div>

                            {/* Column 3: Preview */}
                            <div className="space-y-6 animate-in fade-in slide-in-from-left-12 duration-700 delay-100">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">3. Preview</h3>
                                <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 h-full min-h-[320px]">
                                    <div className="text-center w-full">
                                        <div className="mb-6 flex justify-center">
                                             <div className="relative bg-white dark:bg-transparent rounded-xl shadow-sm border border-gray-200 dark:border-white/10 p-4">
                                                <img 
                                                    src={image || ''} 
                                                    alt="Icon Preview" 
                                                    className="w-32 h-32 object-contain"
                                                />
                                            </div>
                                        </div>
                                        
                                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Included Sizes</span>
                                        <div className="flex flex-wrap justify-center gap-2 max-w-[200px] mx-auto">
                                            {selectedSizes.sort((a,b)=>a-b).map(size => (
                                                <span key={size} className="px-2 py-1 bg-white dark:bg-white/10 rounded-md text-[10px] font-mono text-text-sub dark:text-gray-300 border border-gray-100 dark:border-white/5">
                                                    {size}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Action Bar (Generate & Download Unified) */}
                {image && (
                     <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-lg p-8 text-center max-w-xl mx-auto">
                            {!downloadUrl ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white">Ready to Convert?</h3>
                                        <p className="text-text-sub dark:text-gray-400">Selected sizes will be merged into a single .ico file.</p>
                                    </div>
                                    <button
                                        onClick={generateIco}
                                        disabled={isGenerating || selectedSizes.length === 0}
                                        className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                                    >
                                        {isGenerating ? (
                                            <span className="animate-pulse">Generating...</span>
                                        ) : (
                                            <>
                                                <FileImage className="w-6 h-6" />
                                                Convert to ICO
                                            </>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white">Conversion Complete!</h3>
                                        <p className="text-text-sub dark:text-gray-400">Your favicon.ico is ready for download.</p>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <a 
                                            href={downloadUrl || ''}
                                            download="favicon.ico"
                                            className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download .ico
                                        </a>
                                        <button
                                            onClick={() => { setDownloadUrl(null); }}
                                            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-bold transition-colors"
                                        >
                                            New
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Removed separate Output Section as it's now integrated above */}
        </div>
    );
};
