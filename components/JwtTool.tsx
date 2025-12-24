"use client";

import React, { useState, useEffect } from 'react';
import { Copy, Clock, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const JwtTool: React.FC = () => {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<string | null>(null);
    const [payload, setPayload] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isExpired, setIsExpired] = useState<boolean | null>(null);
    const [expirationDate, setExpirationDate] = useState<string | null>(null);

    const decodeBase64Url = (str: string) => {
        // Add padding if needed
        let output = str.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
            case 0: break;
            case 2: output += "=="; break;
            case 3: output += "="; break;
            default: throw new Error("Illegal base64url string!");
        }
        return decodeURIComponent(atob(output).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };

    const processToken = (input: string) => {
        setToken(input);
        setError(null);
        setHeader(null);
        setPayload(null);
        setIsExpired(null);
        setExpirationDate(null);

        if (!input.trim()) return;

        try {
            const parts = input.split('.');
            if (parts.length !== 3) {
                throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
            }

            const headerDecoded = JSON.parse(decodeBase64Url(parts[0]));
            const payloadDecoded = JSON.parse(decodeBase64Url(parts[1]));

            setHeader(JSON.stringify(headerDecoded, null, 2));
            setPayload(JSON.stringify(payloadDecoded, null, 2));

            // Check expiration
            if (payloadDecoded.exp) {
                const expDate = new Date(payloadDecoded.exp * 1000);
                setExpirationDate(expDate.toLocaleString());
                setIsExpired(expDate < new Date());
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to decode token");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full max-w-none mx-auto min-h-[600px]">
            {/* Input Section */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col h-full min-h-[300px]">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">JWT Token Input</span>
                        <button
                            onClick={() => processToken('')}
                            className="text-xs text-primary hover:underline"
                        >Clear</button>
                    </div>
                    <textarea
                        className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed"
                        value={token}
                        onChange={(e) => processToken(e.target.value)}
                        placeholder="Paste your JWT here (e.g. eyJhbGci...)"
                    />
                </div>
            </div>

            {/* Output Section */}
            <div className="flex-1 flex flex-col gap-6">
                {error ? (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-medium text-sm">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Header</span>
                            </div>
                            <pre className="p-4 font-mono text-xs md:text-sm text-text-main dark:text-blue-300 overflow-x-auto whitespace-pre-wrap">
                                {header || '// Header will appear here'}
                            </pre>
                        </div>

                        {/* Payload */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col relative">
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-purple-500">Payload</span>
                                {expirationDate && (
                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isExpired
                                        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500/30'
                                        : 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500/30'
                                        }`}>
                                        {isExpired ? <ShieldAlert className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                        {isExpired ? 'Expired' : 'Valid'}
                                    </div>
                                )}
                            </div>
                            <pre className="p-4 font-mono text-xs md:text-sm text-text-main dark:text-purple-300 overflow-x-auto whitespace-pre-wrap">
                                {payload || '// Payload will appear here'}
                            </pre>
                            {expirationDate && (
                                <div className="px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    <span>Expires: {expirationDate}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
