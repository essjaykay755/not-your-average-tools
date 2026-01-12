"use client";

import React, { useState, useCallback } from 'react';

type EncodingMode = 'url' | 'urlComponent' | 'base64';

export const UrlEncoderTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState<EncodingMode>('urlComponent');
    const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const process = useCallback(() => {
        setError(null);
        if (!input.trim()) {
            setOutput('');
            return;
        }

        try {
            let result = '';

            if (direction === 'encode') {
                switch (mode) {
                    case 'url':
                        result = encodeURI(input);
                        break;
                    case 'urlComponent':
                        result = encodeURIComponent(input);
                        break;
                    case 'base64':
                        result = btoa(unescape(encodeURIComponent(input)));
                        break;
                }
            } else {
                switch (mode) {
                    case 'url':
                        result = decodeURI(input);
                        break;
                    case 'urlComponent':
                        result = decodeURIComponent(input);
                        break;
                    case 'base64':
                        result = decodeURIComponent(escape(atob(input)));
                        break;
                }
            }

            setOutput(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid input for decoding');
            setOutput('');
        }
    }, [input, mode, direction]);

    // Auto-process on input change
    React.useEffect(() => {
        process();
    }, [process]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swapInputOutput = () => {
        setInput(output);
        setDirection(prev => prev === 'encode' ? 'decode' : 'encode');
    };

    const clearAll = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Controls */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Encoding Mode */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Mode:</span>
                        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                            {[
                                { value: 'urlComponent', label: 'URL Component' },
                                { value: 'url', label: 'Full URL' },
                                { value: 'base64', label: 'Base64' },
                            ].map((m) => (
                                <button
                                    key={m.value}
                                    onClick={() => setMode(m.value as EncodingMode)}
                                    className={`px-4 py-2 text-sm font-medium transition-all ${mode === m.value
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-white/5 text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Direction Toggle */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Action:</span>
                        <div className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                            <button
                                onClick={() => setDirection('encode')}
                                className={`px-4 py-2 text-sm font-medium transition-all ${direction === 'encode'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-white dark:bg-white/5 text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                                    }`}
                            >
                                Encode
                            </button>
                            <button
                                onClick={() => setDirection('decode')}
                                className={`px-4 py-2 text-sm font-medium transition-all ${direction === 'decode'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white dark:bg-white/5 text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                                    }`}
                            >
                                Decode
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input / Output */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Input */}
                <div className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {direction === 'encode' ? 'Plain Text' : 'Encoded Text'}
                        </span>
                        <button
                            onClick={clearAll}
                            className="text-xs text-gray-500 hover:text-primary transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={direction === 'encode'
                            ? 'Enter text to encode...'
                            : 'Enter encoded text to decode...'}
                        className="w-full h-64 p-4 resize-none bg-transparent text-text-main dark:text-white focus:outline-none font-mono text-sm"
                    />
                </div>

                {/* Swap Button (Mobile) */}
                <div className="flex lg:hidden justify-center -my-2">
                    <button
                        onClick={swapInputOutput}
                        className="p-3 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                        <span className="material-symbols-outlined">swap_vert</span>
                    </button>
                </div>

                {/* Output */}
                <div className={`bg-white dark:bg-surface-dark rounded-2xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} overflow-hidden relative`}>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            {direction === 'encode' ? 'Encoded Result' : 'Decoded Result'}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={swapInputOutput}
                                className="hidden lg:flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                                title="Use as input"
                            >
                                <span className="material-symbols-outlined text-sm">swap_horiz</span>
                                Swap
                            </button>
                            <button
                                onClick={copyToClipboard}
                                disabled={!output}
                                className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-sm">
                                    {copied ? 'check' : 'content_copy'}
                                </span>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="h-64 p-4 flex items-center justify-center">
                            <div className="text-center">
                                <span className="material-symbols-outlined text-4xl text-red-400 mb-2">error</span>
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        </div>
                    ) : (
                        <textarea
                            readOnly
                            value={output}
                            placeholder="Result will appear here..."
                            className="w-full h-64 p-4 resize-none bg-transparent text-text-main dark:text-green-400 focus:outline-none font-mono text-sm"
                        />
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                    <div>
                        <span className="font-bold text-text-main dark:text-white">URL Component</span>
                        <p>Encodes special characters including / ? & = etc. Best for query parameters.</p>
                    </div>
                    <div>
                        <span className="font-bold text-text-main dark:text-white">Full URL</span>
                        <p>Preserves URL structure (://) while encoding spaces and special chars.</p>
                    </div>
                    <div>
                        <span className="font-bold text-text-main dark:text-white">Base64</span>
                        <p>Binary-to-text encoding. Useful for embedding data in URLs or JSON.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
