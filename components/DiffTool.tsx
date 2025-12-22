"use client";

import React, { useState, useEffect } from 'react';
import * as Diff from 'diff';

export const DiffTool: React.FC = () => {
    const [oldText, setOldText] = useState('const foo = "bar";\nconsole.log(foo);');
    const [newText, setNewText] = useState('const foo = "baz";\nconsole.error(foo);');
    const [diffs, setDiffs] = useState<Diff.Change[]>([]);

    useEffect(() => {
        // Basic line diff
        const result = Diff.diffLines(oldText, newText);
        setDiffs(result);
    }, [oldText, newText]);

    const oldTextRef = React.useRef<HTMLTextAreaElement>(null);
    const newTextRef = React.useRef<HTMLTextAreaElement>(null);

    const adjustHeight = (el: HTMLTextAreaElement | null) => {
        if (el) {
            el.style.height = 'auto';
            el.style.height = `${el.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight(oldTextRef.current);
    }, [oldText]);

    useEffect(() => {
        adjustHeight(newTextRef.current);
    }, [newText]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-none mx-auto p-4 md:p-4 gap-4">
            <div className="flex items-center justify-end shrink-0">
                <button
                    onClick={() => { setOldText(''); setNewText(''); }}
                    className="px-4 py-2 text-sm font-medium text-text-sub hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="flex-1 flex flex-col gap-4 h-full">
                {/* Inputs */}
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm h-auto">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Original Text</span>
                        </div>
                        <textarea
                            ref={oldTextRef}
                            className="flex-1 w-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
                            value={oldText}
                            onChange={(e) => setOldText(e.target.value)}
                            style={{ minHeight: '300px', height: 'auto' }}
                            placeholder="Paste original text..."
                        />
                    </div>
                    <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm h-auto">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Modified Text</span>
                        </div>
                        <textarea
                            ref={newTextRef}
                            className="flex-1 w-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            style={{ minHeight: '300px', height: 'auto' }}
                            placeholder="Paste modified text..."
                        />
                    </div>
                </div>

                {/* Output */}
                <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[300px]">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Comparison Result</span>
                    </div>
                    <div className="flex-1 w-full p-4 font-mono text-sm bg-gray-50 dark:bg-black/20 overflow-x-auto">
                        {diffs.map((part, index) => {
                            let className = "text-gray-500 dark:text-gray-400";
                            let bgClass = "bg-transparent";

                            if (part.added) {
                                className = "text-green-700 dark:text-green-400";
                                bgClass = "bg-green-100 dark:bg-green-900/20";
                            } else if (part.removed) {
                                className = "text-red-700 dark:text-red-400";
                                bgClass = "bg-red-100 dark:bg-red-900/20";
                            }

                            return (
                                <div key={index} className={`${bgClass} ${className} whitespace-pre-wrap px-1 inline`}>
                                    {part.value}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

