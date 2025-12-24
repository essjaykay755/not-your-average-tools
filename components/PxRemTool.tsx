"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Settings, Type } from 'lucide-react';

export const PxRemTool: React.FC = () => {
    const [px, setPx] = useState<string>('16');
    const [rem, setRem] = useState<string>('1');
    const [rootSize, setRootSize] = useState<number>(16);

    const handlePxChange = (val: string) => {
        setPx(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setRem((num / rootSize).toFixed(4).replace(/\.?0+$/, ''));
        } else {
            setRem('');
        }
    };

    const handleRemChange = (val: string) => {
        setRem(val);
        const num = parseFloat(val);
        if (!isNaN(num)) {
            setPx((num * rootSize).toFixed(1).replace(/\.0$/, ''));
        } else {
            setPx('');
        }
    };

    const handleRootChange = (val: string) => {
        const num = parseFloat(val);
        if (!isNaN(num) && num > 0) {
            setRootSize(num);
            // Update REM based on current PX to maintain PX value (or vice versa? Usually maintaining PX visual is better)
            // Let's recalculate REM
            const currentPx = parseFloat(px);
            if (!isNaN(currentPx)) {
                setRem((currentPx / num).toFixed(4).replace(/\.?0+$/, ''));
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto min-h-[500px] flex flex-col items-center justify-start pt-10">
            {/* Settings */}
            <div className="w-full flex justify-end mb-8">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-text-sub dark:text-gray-400">Root Size:</span>
                    <input
                        type="number"
                        value={rootSize}
                        onChange={(e) => handleRootChange(e.target.value)}
                        className="w-16 bg-transparent text-right font-bold text-text-main dark:text-white focus:outline-none"
                    />
                    <span className="text-sm text-text-sub dark:text-gray-500">px</span>
                </div>
            </div>

            {/* Converter Cards */}
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full">
                
                {/* Pixels Input */}
                <div className="flex-1 w-full bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/20 flex flex-col items-center relative overflow-hidden group focus-within:ring-2 ring-primary/50 transition-all">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Pixels (px)
                    </label>
                    <div className="flex items-baseline gap-1 w-full justify-center">
                        <input
                            type="text"
                            value={px}
                            onChange={(e) => handlePxChange(e.target.value)}
                            placeholder="0"
                            className="w-full text-center text-6xl md:text-7xl font-black text-text-main dark:text-white bg-transparent focus:outline-none tracking-tight placeholder-gray-200 dark:placeholder-white/10"
                        />
                    </div>
                </div>

                {/* Arrow Icon */}
                <div className="shrink-0 p-4 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400">
                    <ArrowRightLeft className="w-6 h-6 md:rotate-0 rotate-90" />
                </div>

                {/* REM Input */}
                <div className="flex-1 w-full bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl shadow-gray-200/50 dark:shadow-black/20 flex flex-col items-center relative overflow-hidden group focus-within:ring-2 ring-purple-500/50 transition-all">
                   <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                        <span className="font-serif italic font-bold">R</span>
                        REM
                    </label>
                    <div className="flex items-baseline gap-1 w-full justify-center">
                        <input
                            type="text"
                            value={rem}
                            onChange={(e) => handleRemChange(e.target.value)}
                            placeholder="0"
                            className="w-full text-center text-6xl md:text-7xl font-black text-text-main dark:text-white bg-transparent focus:outline-none tracking-tight placeholder-gray-200 dark:placeholder-white/10"
                        />
                    </div>
                </div>
            </div>

            {/* Visualizer */}
            <div className="mt-16 w-full max-w-2xl bg-gray-50 dark:bg-white/5 rounded-2xl p-8 border border-gray-200/50 dark:border-white/5 flex flex-col items-center text-center">
                 <h3 className="text-sm font-bold text-text-sub dark:text-gray-400 mb-4">Visual Scale</h3>
                 <div className="flex items-end gap-1 h-32 w-full justify-center opacity-80">
                     <div className="w-16 bg-blue-500/20 rounded-t-lg transition-all duration-300 relative group" style={{ height: '40%' }}>
                        <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs font-mono text-blue-500">{rootSize}px</span>
                     </div>
                     <div className="w-16 bg-purple-500/20 rounded-t-lg transition-all duration-300 relative group" 
                          style={{ height: `${Math.min(100, Math.max(10, (parseFloat(px) || 0) / 2))}%` }}>
                          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs font-mono text-purple-500">{px}px</span>
                     </div>
                 </div>
                 <p className="mt-4 text-xs text-text-sub dark:text-gray-500 max-w-md">
                     Visual comparison assuming default root size baseline.
                 </p>
            </div>
        </div>
    );
};
