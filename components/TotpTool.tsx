"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { KeyRound, Plus, Trash2, Copy, Check, Eye, EyeOff, Shield } from 'lucide-react';

interface TOTPEntry {
    id: string;
    name: string;
    secret: string;
    code: string;
}

// Base32 decoding
const base32Decode = (encoded: string): Uint8Array => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanedInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');

    let bits = '';
    for (const char of cleanedInput) {
        const val = alphabet.indexOf(char);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }

    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }

    return new Uint8Array(bytes);
};

// HMAC-SHA1 implementation using Web Crypto
const hmacSha1 = async (key: Uint8Array, message: Uint8Array): Promise<Uint8Array> => {
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key.buffer as ArrayBuffer,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message.buffer as ArrayBuffer);
    return new Uint8Array(signature);
};

// Generate TOTP code
const generateTOTP = async (secret: string, timeStep: number = 30): Promise<string> => {
    try {
        const key = base32Decode(secret);
        const time = Math.floor(Date.now() / 1000 / timeStep);

        const timeBuffer = new ArrayBuffer(8);
        const view = new DataView(timeBuffer);
        view.setUint32(4, time, false);

        const hmac = await hmacSha1(key, new Uint8Array(timeBuffer));
        const offset = hmac[hmac.length - 1] & 0x0f;

        const code = (
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff)
        ) % 1000000;

        return code.toString().padStart(6, '0');
    } catch {
        return '------';
    }
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const TotpTool: React.FC = () => {
    const [entries, setEntries] = useState<TOTPEntry[]>([]);
    const [newName, setNewName] = useState('');
    const [newSecret, setNewSecret] = useState('');
    const [showSecrets, setShowSecrets] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState(30);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('totp_entries');
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as { id: string; name: string; secret: string }[];
                setEntries(parsed.map(e => ({ ...e, code: '------' })));
            } catch {
                // Ignore parse errors
            }
        }
    }, []);

    // Save to localStorage (without codes)
    useEffect(() => {
        const toSave = entries.map(({ id, name, secret }) => ({ id, name, secret }));
        localStorage.setItem('totp_entries', JSON.stringify(toSave));
    }, [entries]);

    // Update codes every second
    const updateCodes = useCallback(async () => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = 30 - (now % 30);
        setTimeRemaining(remaining);

        const updatedEntries = await Promise.all(
            entries.map(async (entry) => ({
                ...entry,
                code: await generateTOTP(entry.secret),
            }))
        );
        setEntries(updatedEntries);
    }, [entries.map(e => e.secret).join(',')]);

    useEffect(() => {
        updateCodes();
        intervalRef.current = setInterval(updateCodes, 1000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [entries.length]);

    const addEntry = async () => {
        if (!newName.trim() || !newSecret.trim()) return;

        const cleanSecret = newSecret.replace(/\s/g, '').toUpperCase();
        const code = await generateTOTP(cleanSecret);

        setEntries([...entries, {
            id: generateId(),
            name: newName.trim(),
            secret: cleanSecret,
            code,
        }]);

        setNewName('');
        setNewSecret('');
    };

    const removeEntry = (id: string) => {
        setEntries(entries.filter(e => e.id !== id));
    };

    const copyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const progressPercent = (timeRemaining / 30) * 100;

    return (
        <div className="w-full space-y-6">
            {/* Privacy Banner */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-start gap-4">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                    <h3 className="font-bold text-green-800 dark:text-green-200 mb-1">100% Local & Private</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                        Your secrets never leave your browser. All codes are generated locally using the Web Crypto API. Data is stored in your browser's LocalStorage.
                    </p>
                </div>
            </div>

            {/* Timer Progress */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Code Refresh</span>
                    <span className={`text-2xl font-black ${timeRemaining <= 5 ? 'text-red-500' : 'text-primary'}`}>
                        {timeRemaining}s
                    </span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-black/30 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear rounded-full ${timeRemaining <= 5 ? 'bg-red-500' : 'bg-primary'}`}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Entries */}
            <div className="space-y-4">
                {entries.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 rounded-2xl p-12 border border-dashed border-gray-200 dark:border-white/10 text-center">
                        <KeyRound className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">No Authenticators Yet</h3>
                        <p className="text-sm text-gray-400">Add your first TOTP secret below to get started.</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 flex items-center gap-6"
                        >
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <KeyRound className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-text-main dark:text-white truncate">{entry.name}</h3>
                                <p className="text-xs text-gray-400 font-mono truncate">
                                    {showSecrets ? entry.secret : '••••••••••••••••'}
                                </p>
                            </div>

                            <div className="text-right">
                                <div
                                    className="text-3xl font-black font-mono text-primary tracking-widest cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => copyCode(entry.id, entry.code)}
                                    title="Click to copy"
                                >
                                    {copiedId === entry.id ? (
                                        <span className="text-green-500 flex items-center gap-2">
                                            <Check className="w-6 h-6" />
                                            Copied
                                        </span>
                                    ) : (
                                        entry.code.slice(0, 3) + ' ' + entry.code.slice(3)
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => removeEntry(entry.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                title="Remove"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Toggle Secrets */}
            {entries.length > 0 && (
                <button
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                >
                    {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showSecrets ? 'Hide Secrets' : 'Show Secrets'}
                </button>
            )}

            {/* Add New */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Authenticator
                </h3>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Name / Label</label>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g., GitHub, Google"
                            className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 text-text-main dark:text-white border border-gray-200 dark:border-white/10 outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Secret Key (Base32)</label>
                        <input
                            type="text"
                            value={newSecret}
                            onChange={(e) => setNewSecret(e.target.value)}
                            placeholder="e.g., JBSWY3DPEHPK3PXP"
                            className="w-full bg-gray-50 dark:bg-black/20 rounded-xl px-4 py-3 font-mono text-text-main dark:text-white border border-gray-200 dark:border-white/10 outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <button
                    onClick={addEntry}
                    disabled={!newName.trim() || !newSecret.trim()}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Authenticator
                </button>
            </div>

            {/* Instructions */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6 overflow-hidden">
                <h3 className="text-white font-bold mb-4">How to Use</h3>
                <ol className="space-y-2 text-sm text-gray-300 list-decimal list-inside">
                    <li>When setting up 2FA on a website, look for the <span className="text-yellow-400">"Can't scan the QR code?"</span> option.</li>
                    <li>Copy the <span className="text-green-400">Base32 secret key</span> provided.</li>
                    <li>Paste it here along with a name to identify the account.</li>
                    <li>Your 6-digit code will refresh every 30 seconds.</li>
                    <li>Click the code to copy it to your clipboard.</li>
                </ol>
            </div>
        </div>
    );
};
