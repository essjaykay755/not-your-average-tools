"use client";

import React, { useState, useCallback } from 'react';
import { FileText, File as FileIcon, Copy, Upload, Shield, Loader2, AlertCircle } from 'lucide-react';

export const HashGeneratorTool: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
    const [inputText, setInputText] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [hashes, setHashes] = useState<{ md5?: string, sha1?: string, sha256?: string }>({});

    // Simple MD5 implementation or placeholder
    // Since we want to stay dependency-free for now unless permitted, 
    // we'll focus on SHA-1/256 which represent modern security needs.
    // MD5 is complex to implement purely in compact JS code here.
    
    // NOTE: Native Web Crypto API supports SHA-1, SHA-256, SHA-384, SHA-512.
    // MD5 is NOT supported natively in Web Crypto for security reasons.
    
    const computeHashes = async (data: BufferSource) => {
        setLoading(true);
        try {
            const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
            const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
            
            setHashes({
                sha1: bufferToHex(sha1Buffer),
                sha256: bufferToHex(sha256Buffer),
                md5: "MD5 requires external library (not included to keep app light)" // Placeholder
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const bufferToHex = (buffer: ArrayBuffer) => {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    };

    const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setInputText(text);
        if (!text) {
            setHashes({});
            return;
        }
        const encoder = new TextEncoder();
        await computeHashes(encoder.encode(text));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            
            setLoading(true);
            const arrayBuffer = await f.arrayBuffer();
            await computeHashes(arrayBuffer);
        }
    };

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Tabs */}
            <div className="flex p-1.5 bg-gray-100 dark:bg-white/5 rounded-2xl w-fit">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'text' 
                        ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' 
                        : 'text-text-sub dark:text-gray-400 hover:text-text-main dark:hover:text-white'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    Text Input
                </button>
                <button
                    onClick={() => setActiveTab('file')}
                    className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                        activeTab === 'file' 
                        ? 'bg-white dark:bg-surface-dark text-primary shadow-sm' 
                        : 'text-text-sub dark:text-gray-400 hover:text-text-main dark:hover:text-white'
                    }`}
                >
                    <FileIcon className="w-4 h-4" />
                    File Input
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Input Area */}
                <div className="space-y-6">
                    {activeTab === 'text' ? (
                        <div>
                             <label className="block text-sm font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-3">
                                Content to Hash
                            </label>
                            <textarea
                                value={inputText}
                                onChange={handleTextChange}
                                placeholder="Type or paste content here..."
                                className="w-full h-[400px] bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-2xl p-6 font-mono text-sm resize-none focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all shadow-sm"
                            />
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-3">
                                Upload File
                            </label>
                            <div className="relative group h-[400px]">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-surface-dark group-hover:bg-gray-50 dark:group-hover:bg-white/5 group-hover:border-primary/50 transition-all flex flex-col items-center justify-center p-8 text-center shadow-sm">
                                    <div className="p-6 bg-primary/10 rounded-full mb-6 group-hover:scale-110 transition-transform">
                                        <Upload className="w-10 h-10 text-primary" />
                                    </div>
                                    <p className="font-bold text-xl text-text-main dark:text-white mb-2">
                                        {file ? file.name : "Click or drag file here"}
                                    </p>
                                    <p className="text-sm text-text-sub dark:text-gray-400">
                                        {file ? `${(file.size / 1024).toFixed(2)} KB` : "Any file type supported"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Output Area */}
                <div>
                     <label className="block text-sm font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-3">
                        Generated Hashes
                    </label>
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 space-y-8 h-[400px] flex flex-col">
                        {inputText || file ? (
                            <>
                                 <div className="flex-1 space-y-6">
                                     <HashRow label="SHA-256 (Recommended)" value={hashes.sha256} loading={loading} onCopy={copyToClipboard} primary />
                                     <HashRow label="SHA-1 (Legacy)" value={hashes.sha1} loading={loading} onCopy={copyToClipboard} />
                                 </div>
                                 
                                 <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-start gap-3 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-4 rounded-xl text-sm">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <p>MD5 is not supported by the browser's native security API. Only SHA-1 and SHA-256 are available for high-performance client-side hashing.</p>
                                    </div>
                                 </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-text-sub dark:text-gray-500 opacity-50">
                                <Shield className="w-16 h-16 mb-4" />
                                <p className="text-lg">Enter text or upload a file</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const HashRow = ({ label, value, loading, onCopy, primary = false }: { label: string, value?: string, loading: boolean, onCopy: (v: string) => void, primary?: boolean }) => (
    <div className="space-y-1.5 group">
        <label className={`text-xs font-bold uppercase tracking-wider ${primary ? 'text-primary' : 'text-gray-500'}`}>{label}</label>
        <div 
            className={`relative flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                primary 
                ? 'bg-primary/5 border-primary/20 hover:border-primary/50' 
                : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-gray-200 dark:hover:border-white/10'
            }`}
            onClick={() => value && onCopy(value)}
        >
            {loading ? (
                <div className="flex items-center gap-2 text-text-sub dark:text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-mono">Computing...</span>
                </div>
            ) : (
                <code className="text-xs font-mono text-text-main dark:text-gray-200 break-all pr-8 line-clamp-2">
                    {value || "..."}
                </code>
            )}
            
            {value && !loading && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                    <Copy className="w-4 h-4 text-gray-500" />
                </div>
            )}
        </div>
    </div>
);
