"use client";

import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, CheckCircle, Shield, History, Settings } from 'lucide-react';

export const PasswordTool: React.FC = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [history, setHistory] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);

    // Initial Generation
    useEffect(() => {
        generatePassword();
    }, []);

    const generatePassword = () => {
        const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowers = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let chars = '';
        if (includeUppercase) chars += uppers;
        if (includeLowercase) chars += lowers;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        if (chars === '') {
            setPassword('Select at least one option!');
            return;
        }

        let newPassword = '';
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            newPassword += chars[array[i] % chars.length];
        }

        setPassword(newPassword);
        addToHistory(newPassword);
        setCopied(false);
    };

    const addToHistory = (pwd: string) => {
        setHistory(prev => {
            const newHistory = [pwd, ...prev].slice(0, 5); // Keep last 5
            return Array.from(new Set(newHistory)); // Remove dupes if any immediate
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const calculateStrength = () => {
        let score = 0;
        if (length > 8) score++;
        if (length > 12) score++;
        if (includeUppercase) score++;
        if (includeLowercase) score++;
        if (includeNumbers) score++;
        if (includeSymbols) score++;

        if (score < 3) return { text: 'Weak', color: 'bg-red-500', width: '33%' };
        if (score < 5) return { text: 'Medium', color: 'bg-yellow-400', width: '66%' };
        return { text: 'Strong', color: 'bg-green-500', width: '100%' };
    };

    const strength = calculateStrength();

    return (
        <div className="w-full flex flex-col xl:flex-row gap-8 items-start min-h-[600px]">

            {/* Left: Generator & Settings */}
            <div className="flex-1 w-full flex flex-col gap-6">

                {/* Result Card */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-white/5 shadow-xl flex flex-col gap-6">
                    <div className="relative group">
                        <div
                            className="w-full bg-gray-50 dark:bg-black/20 p-6 rounded-2xl text-center font-mono text-3xl md:text-4xl font-black text-text-main dark:text-white break-all cursor-pointer transition-colors hover:bg-primary/5 hover:text-primary tracking-wide selection:bg-primary selection:text-white"
                            onClick={() => copyToClipboard(password)}
                        >
                            {password}
                        </div>
                        <button
                            className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-all hover:text-primary active:scale-95"
                            onClick={() => copyToClipboard(password)}
                            title="Copy"
                        >
                            {copied ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Strength Bar */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                                <Shield className="w-3 h-3" /> Security
                            </label>
                            <span className={`text-xs font-bold ${strength.text === 'Strong' ? 'text-green-500' : strength.text === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                {strength.text}
                            </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} transition-all duration-500 ease-out`} style={{ width: strength.width }}></div>
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generatePassword}
                        className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Generate New Password
                    </button>
                </div>

                {/* Settings Panel */}
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col gap-6">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-white/5">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Configuration</span>
                    </div>

                    {/* Length Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-text-main dark:text-white">Length</label>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                {length} chars
                            </span>
                        </div>
                        <input
                            type="range"
                            min="8"
                            max="64"
                            step="1"
                            value={length}
                            onChange={(e) => setLength(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Uppercase (A-Z)', state: includeUppercase, set: setIncludeUppercase },
                            { label: 'Lowercase (a-z)', state: includeLowercase, set: setIncludeLowercase },
                            { label: 'Numbers (0-9)', state: includeNumbers, set: setIncludeNumbers },
                            { label: 'Symbols (!@#)', state: includeSymbols, set: setIncludeSymbols },
                        ].map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => opt.set(!opt.state)}
                                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${opt.state
                                        ? 'bg-primary/5 border-primary text-primary font-bold'
                                        : 'bg-gray-50 dark:bg-white/5 border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-sm">{opt.label}</span>
                                {opt.state && <CheckCircle className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Right: History Settings */}
            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm min-h-[400px]">
                    <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-white/5 mb-4">
                        <History className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-sm uppercase tracking-wider text-gray-500">Recent History</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {history.slice(1).map((pwd, i) => (
                            <div
                                key={i}
                                className="group p-4 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-white/10 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/10"
                                onClick={() => copyToClipboard(pwd)}
                            >
                                <span className="font-mono text-xs text-gray-600 dark:text-gray-400 truncate max-w-[200px]">{pwd}</span>
                                <Copy className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100" />
                            </div>
                        ))}
                        {history.length <= 1 && (
                            <div className="text-center py-10 text-gray-400 text-sm italic">
                                History will appear here...
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};
