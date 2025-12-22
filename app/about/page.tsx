"use client";

import React from 'react';
import { Shield, Zap, Code, Terminal } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen w-full pt-32 pb-20 items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 dark:opacity-40"></div>
                {/* Secondary bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-30"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                    The Mission
                </span>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-main dark:text-white mb-8">
                    WE DON'T DO <span className="text-primary">AVERAGE.</span>
                </h1>

                <p className="text-xl md:text-2xl text-text-sub dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-16">
                    NotYourAverage.Tools was born from a simple frustration: most developer tools are ugly, ad-ridden, or overcomplicated. We built the alternative.
                </p>

                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-colors">
                        <Zap className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">On-Device Speed</h3>
                        <p className="text-text-sub dark:text-gray-400">Zero latency. All processing happens locally on your machine. No server round-trips.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-colors">
                        <Shield className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Fully Private</h3>
                        <p className="text-text-sub dark:text-gray-400">What you paste here, stays here. Your data never leaves your browser. 100% offline capable.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/30 transition-colors">
                        <Code className="w-10 h-10 text-primary mb-6" />
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-3">Open Source</h3>
                        <p className="text-text-sub dark:text-gray-400">Transparent to the core. Audit the code, contribute to the repo, or fork it for your own needs.</p>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-gray-100 dark:border-white/5 flex flex-col items-center">
                    <Terminal className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                    <p className="text-sm font-mono text-gray-400 uppercase tracking-widest">
                        System Status: Operational
                    </p>
                </div>
            </div>
        </div>
    );
}
