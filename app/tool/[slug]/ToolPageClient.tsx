"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, X, Lightbulb, Shield, Info } from 'lucide-react';
import { getToolBySlug } from '@/data/tools';

interface ToolPageClientProps {
    slug: string;
    name: string;
    description: string;
    category: string;
    usage: string;
    children: React.ReactNode;
}

// Parse usage string into structured steps
const parseUsageSteps = (usage: string) => {
    const sentences = usage.split(/[.!]/).filter(s => s.trim().length > 0);
    return sentences.map((sentence, idx) => ({
        step: idx + 1,
        text: sentence.trim()
    }));
};

export function ToolPageClient({ slug, name, description, category, usage, children }: ToolPageClientProps) {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Look up the tool on the client side to get the icon component and usage steps
    const tool = getToolBySlug(slug);
    const IconComponent = tool?.icon;
    const usageSteps = tool?.usageSteps;
    const parsedSteps = parseUsageSteps(usage);

    // Handle open animation
    useEffect(() => {
        if (isHelpOpen) {
            // Small delay to trigger the transition after mount
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
        }
    }, [isHelpOpen]);

    const closeModal = () => {
        setIsClosing(true);
        setIsVisible(false);
        setTimeout(() => {
            setIsHelpOpen(false);
            setIsClosing(false);
        }, 200); // Match animation duration
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Unified Tool Card */}
            <div className="relative w-full max-w-[95%] 2xl:max-w-[1800px] mx-auto rounded-[2.5rem] bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden mb-20 mt-6 min-h-[80vh]">

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
                    {IconComponent && (
                        <div className="absolute -top-6 -left-6 z-0 pointer-events-none opacity-[0.06] dark:opacity-[0.04] transform -rotate-12">
                            <IconComponent strokeWidth={1.5} className="w-[250px] h-[250px] text-text-main dark:text-white" />
                        </div>
                    )}

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
                            {category}
                        </span>

                        <h1 className="text-2xl md:text-3xl font-black text-text-main dark:text-white tracking-tight">
                            {name}
                        </h1>

                        <p className="text-sm md:text-base text-text-sub dark:text-gray-400 max-w-xl leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Tool Functionality Area (Integrated) */}
                <div className="relative z-10 p-4 pt-4 md:px-8 md:py-6 lg:px-10 lg:py-8">
                    {children}
                </div>
            </div>

            {/* Enhanced Help Modal */}
            {isHelpOpen && (
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-200 ${isVisible ? 'bg-black/30 dark:bg-black/60 opacity-100' : 'bg-transparent opacity-0'
                        }`}
                    onClick={closeModal}
                >
                    <div
                        className={`bg-white dark:bg-[#1a1a1a] rounded-3xl max-w-2xl w-full shadow-2xl ring-1 ring-black/5 dark:ring-white/10 relative overflow-hidden max-h-[90vh] flex flex-col transition-all duration-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            }`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 p-6 pb-8">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
                                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>

                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                            </button>

                            <div className="relative flex items-start gap-4">
                                <div className="p-4 rounded-2xl bg-white dark:bg-white/10 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                                    {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary text-white">
                                            {category}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-text-main dark:text-white truncate">{name}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* About Section */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                                        <Info className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-text-main dark:text-white">About This Tool</h3>
                                </div>
                                <p className="text-text-sub dark:text-gray-300 leading-relaxed text-sm">
                                    {description}
                                </p>
                            </div>

                            {/* How to Use Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                        <Lightbulb className="w-4 h-4" />
                                    </div>
                                    <h3 className="font-bold text-text-main dark:text-white">How to Use</h3>
                                </div>

                                {usageSteps && usageSteps.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {usageSteps.map((step, idx) => (
                                            <div key={idx} className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:border-primary/30 dark:hover:border-primary/30 transition-colors group">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                                                        {step.icon ? <step.icon className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-sm text-text-main dark:text-gray-200 mb-1">{step.title}</h4>
                                                        <p className="text-xs text-text-sub dark:text-gray-400 leading-relaxed">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {parsedSteps.map((step, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/10">
                                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold">{step.step}</span>
                                                </div>
                                                <p className="text-sm text-text-sub dark:text-gray-300 leading-relaxed pt-0.5">
                                                    {step.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Privacy Notice */}
                            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 shrink-0">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-green-700 dark:text-green-300 mb-1">Your Privacy Matters</h4>
                                    <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                                        All processing happens locally in your browser. Your data is never uploaded to any server.
                                        Close this tab and everything is gone — no traces left behind.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
