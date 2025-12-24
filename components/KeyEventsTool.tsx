"use client";

import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';

type KeyEventData = {
    key: string;
    code: string;
    which: number;
    keyCode: number; // Deprecated but asked for
    location: number;
    metaKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    shiftKey: boolean;
};

export const KeyEventsTool: React.FC = () => {
    const [eventData, setEventData] = useState<KeyEventData | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();
            setEventData({
                key: e.key,
                code: e.code,
                which: e.which,
                keyCode: e.keyCode,
                location: e.location,
                metaKey: e.metaKey,
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!eventData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] w-full text-center animate-in fade-in zoom-in duration-500">
                 <div className="w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 animate-bounce duration-[2000ms]">
                    <Keyboard className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                 </div>
                <h2 className="text-3xl font-black text-text-main dark:text-white mb-4">Press any key</h2>
                <p className="text-text-sub dark:text-gray-400 text-lg max-w-sm">
                    Focus this window and press any key on your keyboard to see its event details.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[500px] flex flex-col items-center justify-start pt-10">
            {/* Main Key Display */}
            <div className="mb-16 relative group">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white dark:bg-surface-dark w-48 h-48 md:w-64 md:h-64 rounded-[3rem] shadow-2xl shadow-primary/10 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center">
                    <span className="text-8xl md:text-9xl font-black text-primary">
                        {eventData.key === ' ' ? 'Space' : eventData.key}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-4">
                        e.key
                    </span>
                </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                
                <DetailCard label="e.code" value={eventData.code} />
                <DetailCard label="e.which" value={eventData.which} sub="(Deprecated)" />
                <DetailCard label="e.keyCode" value={eventData.keyCode} sub="(Deprecated)" />
                <DetailCard label="e.location" value={eventData.location} />
                
            </div>

            {/* Modifiers */}
            <div className="mt-8 flex gap-4">
                <ModifierBadge label="Meta" active={eventData.metaKey} />
                <ModifierBadge label="Ctrl" active={eventData.ctrlKey} />
                <ModifierBadge label="Alt" active={eventData.altKey} />
                <ModifierBadge label="Shift" active={eventData.shiftKey} />
            </div>
            
            <p className="mt-12 text-xs text-text-sub dark:text-gray-500 animate-pulse">
                Press another key to update...
            </p>
        </div>
    );
};

const DetailCard = ({ label, value, sub }: { label: string, value: string | number, sub?: string }) => (
    <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 text-center border border-gray-100 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:shadow-lg transition-all duration-300">
        <h3 className="text-sm font-bold text-gray-500 mb-2">{label}</h3>
        <p className="text-2xl font-black text-text-main dark:text-white font-mono break-all">{value}</p>
        {sub && <p className="text-[10px] text-red-400 mt-1">{sub}</p>}
    </div>
);

const ModifierBadge = ({ label, active }: { label: string, active: boolean }) => (
    <div className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
        active 
        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 transform -translate-y-1' 
        : 'bg-gray-100 dark:bg-white/5 text-gray-400'
    }`}>
        {label}
    </div>
);
