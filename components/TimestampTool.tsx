"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Copy, RefreshCw, Calendar, ArrowRightLeft } from 'lucide-react';

export const TimestampTool: React.FC = () => {
    const [input, setInput] = useState<string>("");
    const [now, setNow] = useState<number>(Date.now());
    const [parsedDate, setParsedDate] = useState<Date | null>(null);

    // Update "now" every second
    useEffect(() => {
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Initial input set to now
    useEffect(() => {
        if (!input) handleNow();
    }, []);

    const handleNow = () => {
        const n = Date.now();
        setInput(Math.floor(n / 1000).toString());
        parseInput(Math.floor(n / 1000).toString());
    };

    const parseInput = (val: string) => {
        if (!val) {
            setParsedDate(null);
            return;
        }

        // Try numeric (Unix timestamp)
        // Heuristic: If < 10000000000, assume seconds. Else millis.
        // Current millis is ~1.7e12 (13 digits). Seconds is ~1.7e9 (10 digits).
        
        let d: Date | null = null;
        
        if (/^\d+$/.test(val)) {
            const num = parseInt(val, 10);
            if (val.length <= 11) {
                // Seconds
                d = new Date(num * 1000);
            } else {
                // Millis
                d = new Date(num);
            }
        } else {
            // Try date parsing
            const parsed = Date.parse(val);
            if (!isNaN(parsed)) {
                d = new Date(parsed);
            }
        }
        
        setParsedDate(d);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setInput(v);
        parseInput(v);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add toast here
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            {/* Input Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 md:p-12">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-3">
                            Enter Timestamp or Date
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={input}
                                onChange={handleInputChange}
                                placeholder="e.g. 1672531200 or 2023-01-01"
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-6 py-5 font-mono text-xl text-text-main dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all group-hover:border-primary/20"
                            />
                            <Clock className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                        </div>
                    </div>
                    <button
                        onClick={handleNow}
                        className="px-8 py-5 bg-primary/10 hover:bg-primary/20 text-primary rounded-2xl font-bold transition-colors flex items-center gap-3 h-[70px] text-lg active:scale-95 duration-200"
                    >
                        <RefreshCw className="w-6 h-6" />
                        Now
                    </button>
                </div>
                
                <div className="mt-6 flex items-center gap-3 text-sm text-text-sub dark:text-gray-500 font-mono">
                    <span>Current Epoch:</span>
                    <span 
                        className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-primary cursor-pointer hover:bg-primary/10 transition-colors select-all" 
                        onClick={handleNow}
                    >
                        {Math.floor(now / 1000)}
                    </span>
                </div>
            </div>

            {/* Output Section */}
            {parsedDate && !isNaN(parsedDate.getTime()) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    {/* Main Formats */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 space-y-8">
                        <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-text-main dark:text-white">Date Formats</h3>
                        </div>

                        <div className="space-y-4">
                            <OutputRow label="UTC (ISO 8601)" value={parsedDate!.toISOString()} onCopy={copyToClipboard} />
                            <OutputRow label="Local" value={parsedDate!.toString()} onCopy={copyToClipboard} />
                            <OutputRow label="Date Only" value={parsedDate!.toDateString()} onCopy={copyToClipboard} />
                            <OutputRow label="Time Only" value={parsedDate!.toTimeString()} onCopy={copyToClipboard} />
                        </div>
                    </div>

                    {/* Numeric Formats */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-8 space-y-8">
                         <div className="flex items-center gap-4 pb-6 border-b border-gray-100 dark:border-white/5">
                            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
                                <ArrowRightLeft className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl text-text-main dark:text-white">Conversions</h3>
                        </div>

                         <div className="space-y-4">
                            <OutputRow label="Unix Timestamp (Seconds)" value={Math.floor(parsedDate!.getTime() / 1000).toString()} onCopy={copyToClipboard} mono />
                            <OutputRow label="Unix Timestamp (Millis)" value={parsedDate!.getTime().toString()} onCopy={copyToClipboard} mono />
                            <OutputRow label="Relative" value={getRelativeTime(parsedDate!)} onCopy={copyToClipboard} />
                        </div>
                    </div>
                </div>
            ) : input ? (
                <div className="text-center p-16 bg-white dark:bg-surface-dark rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 text-gray-400">
                    <p className="text-lg">Invalid Date or Timestamp</p>
                </div>
            ) : null}
        </div>
    );
};

const OutputRow = ({ label, value, onCopy, mono = false }: { label: string, value: string, onCopy: (v: string) => void, mono?: boolean }) => (
    <div className="group">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">{label}</label>
        <div 
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all cursor-pointer"
            onClick={() => onCopy(value)}
        >
            <span className={`text-sm text-text-main dark:text-gray-200 truncate pr-4 ${mono ? 'font-mono' : ''}`}>{value}</span>
            <Copy className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    </div>
);

const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const absDiff = Math.abs(diff);
    const suffix = diff > 0 ? 'ago' : 'from now';

    const seconds = Math.floor(absDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (seconds < 60) return `Just now`;
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ${suffix}`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ${suffix}`;
    if (days < 365) return `${days} day${days !== 1 ? 's' : ''} ${suffix}`;
    return `${years} year${years !== 1 ? 's' : ''} ${suffix}`;
};
