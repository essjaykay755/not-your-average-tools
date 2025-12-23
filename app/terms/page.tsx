"use client";

import React from 'react';
import { Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-main dark:text-white mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-text-sub dark:text-gray-400 max-w-2xl mx-auto">
                        Simple rules for a simple toolset. Be nice, do good.
                    </p>
                </div>

                <div className="space-y-12">
                    <div className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            By accessing and using NotYourAverage.Tools, you accept and agree to be bound by the terms and provision of this agreement.
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">2. Use License</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            Permission is granted to use these tools for personal or commercial purposes. You are free to generate content, process files, and utilize the utilities provided. The project is free to use.
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">3. Disclaimer</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            The materials on NotYourAverage.Tools are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500 text-sm text-yellow-800 dark:text-yellow-200 mb-6">
                            <strong>Note:</strong> While we prioritize accuracy and security, do not use these tools for critical security infrastructure or life-dependent systems without verification.
                        </div>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">4. Limitations</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            In no event shall NotYourAverage.Tools or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">5. Governing Law</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            Any claim relating to NotYourAverage.Tools's website shall be governed by the laws of the operating jurisdiction without regard to its conflict of law provisions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
