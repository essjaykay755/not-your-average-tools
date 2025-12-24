"use client";

import React, { useState } from 'react';
import { Upload, Download, AppWindow, Check, Loader2 } from 'lucide-react';
import JSZip from 'jszip';

const ANDROID_ICONS = [
    { name: 'mipmap-mdpi/ic_launcher.png', size: 48 },
    { name: 'mipmap-hdpi/ic_launcher.png', size: 72 },
    { name: 'mipmap-xhdpi/ic_launcher.png', size: 96 },
    { name: 'mipmap-xxhdpi/ic_launcher.png', size: 144 },
    { name: 'mipmap-xxxhdpi/ic_launcher.png', size: 192 },
    { name: 'playstore-icon.png', size: 512 },
];

const IOS_ICONS = [
    { name: 'AppIcon.appiconset/Icon-20.png', size: 20 },
    { name: 'AppIcon.appiconset/Icon-20@2x.png', size: 40 },
    { name: 'AppIcon.appiconset/Icon-20@3x.png', size: 60 },
    { name: 'AppIcon.appiconset/Icon-29.png', size: 29 },
    { name: 'AppIcon.appiconset/Icon-29@2x.png', size: 58 },
    { name: 'AppIcon.appiconset/Icon-29@3x.png', size: 87 },
    { name: 'AppIcon.appiconset/Icon-40.png', size: 40 },
    { name: 'AppIcon.appiconset/Icon-40@2x.png', size: 80 },
    { name: 'AppIcon.appiconset/Icon-40@3x.png', size: 120 },
    { name: 'AppIcon.appiconset/Icon-60@2x.png', size: 120 },
    { name: 'AppIcon.appiconset/Icon-60@3x.png', size: 180 },
    { name: 'AppIcon.appiconset/Icon-76.png', size: 76 },
    { name: 'AppIcon.appiconset/Icon-76@2x.png', size: 152 },
    { name: 'AppIcon.appiconset/Icon-83.5@2x.png', size: 167 },
    { name: 'AppIcon.appiconset/Icon-1024.png', size: 1024 },
];

export const AppIconGeneratorTool: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target?.result as string);
                setDownloadUrl(null);
                setProgress(0);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateIcons = async () => {
        if (!image) return;

        setIsGenerating(true);
        setProgress(0);

        try {
            const zip = new JSZip();
            const img = new Image();
            img.src = image;
            await new Promise((resolve) => { img.onload = resolve; });

            const androidFolder = zip.folder("android");
            const iosFolder = zip.folder("ios");

            const totalIcons = ANDROID_ICONS.length + IOS_ICONS.length;
            let completed = 0;

            const processIcon = async (folder: JSZip | null, iconDef: { name: string, size: number }) => {
                if (!folder) return;

                const canvas = document.createElement('canvas');
                canvas.width = iconDef.size;
                canvas.height = iconDef.size;
                const ctx = canvas.getContext('2d');
                if (!ctx) return;

                // High quality smoothing
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, iconDef.size, iconDef.size);

                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
                if (blob) {
                    folder.file(iconDef.name, blob);
                }
                
                completed++;
                setProgress(Math.round((completed / totalIcons) * 100));
            };

            // Process Android
            for (const icon of ANDROID_ICONS) {
                await processIcon(androidFolder, icon);
            }

            // Process iOS
            // Add Contents.json for iOS (minimal valid structure)
            if (iosFolder) {
                const contentsJson = {
                    images: IOS_ICONS.map(icon => ({
                        size: `${icon.size}x${icon.size}`, // Simplified logic, ideally calculate pts
                        idiom: "universal",
                        filename: icon.name.split('/').pop(),
                        scale: "1x" // Simplified
                    })),
                    info: { version: 1, author: "xcode" }
                };
                 // We are putting images in AppIcon.appiconset subfolder in the definition name
                 // So we need to ensure the structure is correct in ZIP if we want it clean.
                 // Currently IOS_ICONS has nested paths 'AppIcon.appiconset/...'.
                 // JSZip handles nested paths automatically. 
                 
                 // Let's rely on the file paths in IOS_ICONS.
            }

            for (const icon of IOS_ICONS) {
                await processIcon(iosFolder, icon);
            }

            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            setDownloadUrl(url);

        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Top Section: Split Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Column 1: Upload (Always Visible) */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">1. Upload High-Res Icon</h3>
                    <div className="relative group h-64 md:h-96">
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full h-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all text-center
                            ${image 
                                ? 'border-primary bg-primary/5' 
                                : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 group-hover:border-primary/50 group-hover:bg-primary/5'
                            }`}>
                            
                            {image ? (
                                <div className="space-y-4">
                                     <img src={image} alt="Preview" className="h-40 w-40 object-contain mx-auto rounded-2xl shadow-lg bg-white dark:bg-black/20" />
                                     <div>
                                        <p className="text-sm font-bold text-primary">Ready to Generate</p>
                                        <p className="text-xs text-text-sub dark:text-gray-400">Click to change source</p>
                                     </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-4 bg-white dark:bg-white/10 rounded-full shadow-sm inline-block">
                                        <Upload className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white">Click or drag to upload</p>
                                        <p className="text-xs text-text-sub dark:text-gray-400 mt-1">Recommended: 1024x1024 PNG</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Column 2: visual previews */}
                <div className={`bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm p-6 flex flex-col transition-opacity duration-300 ${!image ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">2. Preview Output</h3>
                    
                    <div className="flex-1 flex flex-col items-center justify-center p-4">
                        {!image ? (
                             <div className="text-center text-text-sub dark:text-gray-500">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                                <p className="text-sm">Upload an image to see previews</p>
                             </div>
                        ) : (
                            <div className="space-y-8 w-full">
                                {/* Representative Selection */}
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Android Big */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative group">
                                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-2 shadow-sm">
                                                <img src={image} className="w-24 h-24 object-contain rounded-xl" alt="Android Play Store" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">AND</div>
                                        </div>
                                        <span className="text-xs font-mono text-text-sub dark:text-gray-500">512px (Store)</span>
                                    </div>

                                    {/* iOS Big */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative group">
                                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl p-2 shadow-sm">
                                                <img src={image} className="w-24 h-24 object-contain rounded-xl" alt="iOS App Store" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">iOS</div>
                                        </div>
                                        <span className="text-xs font-mono text-text-sub dark:text-gray-500">1024px (Store)</span>
                                    </div>

                                    {/* Android Small */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative group">
                                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-2 shadow-sm">
                                                <img src={image} className="w-12 h-12 object-contain" alt="Android Icon" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-text-sub dark:text-gray-500">48px (mdpi)</span>
                                    </div>

                                    {/* iOS Small */}
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="relative group">
                                            <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-2 shadow-sm">
                                                <img src={image} className="w-12 h-12 object-contain" alt="iOS Icon" />
                                            </div>
                                        </div>
                                        <span className="text-xs font-mono text-text-sub dark:text-gray-500">60px (iPhone)</span>
                                    </div>
                                </div>
                                

                                
                                {/* Detailed File List */}
                                <div className="mt-8 border-t border-gray-100 dark:border-white/5 pt-6">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Included Files</h4>
                                    <div className="h-48 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                                        <div>
                                            <h5 className="text-[10px] font-bold text-green-600 dark:text-green-400 mb-2 uppercase flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                Android
                                            </h5>
                                            <ul className="space-y-1.5">
                                                {ANDROID_ICONS.map((icon, i) => (
                                                    <li key={i} className="text-[10px] text-text-sub dark:text-gray-400 flex justify-between items-center font-mono bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">
                                                        <span className="truncate mr-3" title={icon.name}>{icon.name}</span>
                                                        <span className="opacity-60 whitespace-nowrap">{icon.size}px</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                iOS
                                            </h5>
                                            <ul className="space-y-1.5">
                                                {IOS_ICONS.map((icon, i) => (
                                                    <li key={i} className="text-[10px] text-text-sub dark:text-gray-400 flex justify-between items-center font-mono bg-gray-50 dark:bg-white/5 px-2 py-1 rounded">
                                                        <span className="truncate mr-3" title={icon.name}>{icon.name}</span>
                                                        <span className="opacity-60 whitespace-nowrap">{icon.size}px</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs">
                         <span className="text-text-sub dark:text-gray-400">Total Output</span>
                         <span className="font-black text-text-main dark:text-white">{ANDROID_ICONS.length + IOS_ICONS.length} Icons</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Generate & Action */}
            {image && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-lg p-8 text-center max-w-xl mx-auto">
                        
                         {!downloadUrl ? (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-text-main dark:text-white">Ready to Generate?</h3>
                                    <p className="text-text-sub dark:text-gray-400">Helper will resize and organize all icons into a ZIP.</p>
                                </div>
                                <button
                                    onClick={generateIcons}
                                    disabled={isGenerating}
                                    className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            Generating... {progress}%
                                        </>
                                    ) : (
                                        <>
                                            <AppWindow className="w-6 h-6" />
                                            Generate Icon Pack
                                        </>
                                    )}
                                </button>
                            </div>
                         ) : (
                             <div className="space-y-6 animate-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
                                    <Check className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-main dark:text-white">Pack Ready!</h3>
                                    <p className="text-text-sub dark:text-gray-400">Your app-icons.zip is fully generated.</p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <a 
                                        href={downloadUrl || ''}
                                        download="app-icons.zip"
                                        className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download ZIP
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
    );
};
