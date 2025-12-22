"use client";

import React from 'react';
import { Mail, Github, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen w-full pt-32 pb-20 items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50 dark:opacity-40"></div>
                {/* Secondary bottom glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-30"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                    Comms Open
                </span>

                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-text-main dark:text-white mb-8">
                    INITIATE <span className="text-primary">SIGNAL.</span>
                </h1>

                <p className="text-xl md:text-2xl text-text-sub dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-16">
                    Have a feature request, a bug report, or just want to talk code? We are listening.
                </p>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <Link href="mailto:hello@notyouraverage.tools" className="group p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-primary/50 transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-text-main dark:text-white">Email Us</h3>
                                <p className="text-sm text-text-sub dark:text-gray-400">Direct encrypted line.</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="https://github.com/essjaykay755/not-your-average-tools" target="_blank" className="group p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-text-main dark:text-white group-hover:scale-110 transition-transform">
                                <Github className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-text-main dark:text-white">GitHub</h3>
                                <p className="text-sm text-text-sub dark:text-gray-400">Check the source.</p>
                            </div>
                        </div>
                    </Link>

                    <Link href="https://x.com/essjaykay755" target="_blank" className="group p-6 rounded-3xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-black dark:text-white group-hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-text-main dark:text-white">X (Twitter)</h3>
                                <p className="text-sm text-text-sub dark:text-gray-400">Follow for updates.</p>
                            </div>
                        </div>
                    </Link>

                    <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center">
                        <div className="text-center opacity-50">
                            <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs font-bold uppercase tracking-widest">More Channels Soon</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
