"use client";

import React from 'react';
import { Shield, Lock, EyeOff } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 mb-6">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-text-main dark:text-white mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-text-sub dark:text-gray-400 max-w-2xl mx-auto">
                        Your data is yours. We don't want it, we can't see it, and we don't store it.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Key Points */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <Shield className="w-8 h-8 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">No Data Collection</h3>
                            <p className="text-sm text-text-sub dark:text-gray-400">All processing happens locally on your device. We do not transmit your input data to any server.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <Lock className="w-8 h-8 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Local Storage Only</h3>
                            <p className="text-sm text-text-sub dark:text-gray-400">Preferences (like theme or history) are stored in your browser's LocalStorage. You can clear this anytime.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10">
                            <EyeOff className="w-8 h-8 text-primary mb-4" />
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">No Tracking</h3>
                            <p className="text-sm text-text-sub dark:text-gray-400">We do not use cookies for tracking or advertising purposes. (Note: standard analytics may be used for site health).</p>
                        </div>
                    </div>

                    <div className="prose dark:prose-invert max-w-none">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">1. Data Processing</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            NotYourAverage.Tools is built as a client-side application. When you use tools like the Image Optimizer, Password Generator, or PDF utilities, the computation is performed entirely within your browser using WebAssembly or JavaScript. Your files and text inputs are never uploaded to our servers.
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">2. Analytics</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            We may use basic, privacy-focused analytics (like Google Analytics) solely to understand website traffic and improve performance. These tools may collect anonymous usage data but do not access your personal inputs or generated content.
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">3. Third-Party Services</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            Some tools may rely on open-source libraries (e.g., Pyodide, SQL.js) which are loaded from CDNs. These requests are standard web traffic and are subject to the privacy policies of the respective CDN providers (e.g., jsDelivr, Cloudflare).
                        </p>

                        <h2 className="text-2xl font-bold text-text-main dark:text-white mb-4">4. Updates</h2>
                        <p className="text-text-sub dark:text-gray-400 mb-6 leading-relaxed">
                            We may update this policy occasionally. Continued use of the site signifies your acceptance of any changes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
