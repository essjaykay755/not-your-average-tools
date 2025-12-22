
"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MarkdownTool } from '@/components/MarkdownTool';
import { JsonTool } from '@/components/JsonTool';
import { QrTool } from '@/components/QrTool';
import { Base64Tool } from '@/components/Base64Tool';
import { RegexTool } from '@/components/RegexTool';
import { ColorTool } from '@/components/ColorTool';
import { LoremTool } from '@/components/LoremTool';
import { DiffTool } from '@/components/DiffTool';
import { WatermarkTool } from '@/components/WatermarkTool';
import { getToolBySlug } from '@/data/tools';
import { SearchX, ArrowLeft, HelpCircle, X } from 'lucide-react';

const ToolPage = () => {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const tool = getToolBySlug(slug);
    const [isHelpOpen, setIsHelpOpen] = useState(false);

    const renderTool = () => {
        switch (slug) {
            case 'markdown': return <MarkdownTool />;
            case 'json': return <JsonTool />;
            case 'qr': return <QrTool />;
            case 'base64': return <Base64Tool />;
            case 'regex': return <RegexTool />;
            case 'color': return <ColorTool />;
            case 'lorem': return <LoremTool />;
            case 'diff': return <DiffTool />;
            case 'watermark': return <WatermarkTool />;
            default: return null;
        }
    };

    if (!tool) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="size-24 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-500/20">
                    <SearchX className="w-10 h-10 text-red-500/50" />
                </div>
                <h1 className="text-3xl font-black text-text-main dark:text-white mb-4">Tool Not Found</h1>
                <p className="text-text-sub dark:text-gray-400 text-lg mb-8 max-w-md">The tool you are looking for does not exist in our arsenal.</p>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    Return to Arsenal
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Unified Tool Card */}
            <div className="relative w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto rounded-[2.5rem] bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden mb-20 mt-4 min-h-[80vh]">

                {/* Background Decor (Container Level) */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 md:top-8 md:left-8 z-50 group flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md border border-gray-200/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all hover:pl-3"
                >
                    <ArrowLeft className="w-4 h-4 text-text-sub dark:text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-sm text-text-main dark:text-white">Back</span>
                </Link>

                {/* Header Section (Integrated) */}
                <div className="relative z-10 px-8 py-6 md:px-10 md:py-8 flex flex-col items-center text-center border-b border-gray-100 dark:border-white/5">
                    {/* Watermark Icon (Header Scope) */}
                    <div className="absolute -top-6 -left-6 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.04] transform -rotate-12">
                        <tool.icon strokeWidth={1.5} className="w-[250px] h-[250px] text-text-main dark:text-white" />
                    </div>

                    {/* Help Icon */}
                    <button
                        onClick={() => setIsHelpOpen(true)}
                        className="absolute top-6 right-6 md:top-8 md:right-8 z-50 p-2 rounded-full text-text-sub dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary transition-colors group"
                        title="Tool Guide"
                    >
                        <HelpCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                            {tool.category}
                        </span>

                        <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">
                            {tool.name}
                        </h1>

                        <p className="text-sm md:text-base text-text-sub dark:text-gray-400 max-w-xl leading-relaxed">
                            {tool.description}
                        </p>
                    </div>
                </div>

                {/* Tool Functionality Area (Integrated) */}
                <div className="relative z-10 p-4 pt-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
                    {renderTool()}
                </div>
            </div>

            {/* Help Modal */}
            {isHelpOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 dark:bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsHelpOpen(false)}>
                    <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-8 max-w-lg w-full shadow-2xl ring-1 ring-black/5 dark:ring-white/10 relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsHelpOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <tool.icon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{tool.name}</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-primary"></span>
                                    What is it?
                                </h3>
                                <p className="text-text-sub dark:text-gray-300 leading-relaxed text-sm">
                                    {tool.description}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-primary"></span>
                                    How to use
                                </h3>
                                <p className="text-text-sub dark:text-gray-300 leading-relaxed text-sm">
                                    {tool.usage}
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button
                                onClick={() => setIsHelpOpen(false)}
                                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolPage;
