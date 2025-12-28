"use client";

import React, { useState, useMemo } from 'react';
import { Copy, Check, Lightbulb, AlertCircle, Code } from 'lucide-react';

interface TokenExplanation {
    token: string;
    explanation: string;
    type: 'quantifier' | 'anchor' | 'group' | 'class' | 'escape' | 'literal' | 'operator';
}

const REGEX_PATTERNS: { pattern: RegExp; explanation: (match: string) => string; type: TokenExplanation['type'] }[] = [
    // Anchors
    { pattern: /^\^/, explanation: () => 'Start of string', type: 'anchor' },
    { pattern: /\$$/, explanation: () => 'End of string', type: 'anchor' },
    { pattern: /\\b/, explanation: () => 'Word boundary', type: 'anchor' },
    { pattern: /\\B/, explanation: () => 'Non-word boundary', type: 'anchor' },

    // Character classes
    { pattern: /\\d/, explanation: () => 'Any digit (0-9)', type: 'class' },
    { pattern: /\\D/, explanation: () => 'Any non-digit', type: 'class' },
    { pattern: /\\w/, explanation: () => 'Any word character (a-z, A-Z, 0-9, _)', type: 'class' },
    { pattern: /\\W/, explanation: () => 'Any non-word character', type: 'class' },
    { pattern: /\\s/, explanation: () => 'Any whitespace (space, tab, newline)', type: 'class' },
    { pattern: /\\S/, explanation: () => 'Any non-whitespace', type: 'class' },
    { pattern: /\./, explanation: () => 'Any character except newline', type: 'class' },

    // Quantifiers
    { pattern: /\*/, explanation: () => 'Zero or more times', type: 'quantifier' },
    { pattern: /\+/, explanation: () => 'One or more times', type: 'quantifier' },
    { pattern: /\?/, explanation: () => 'Zero or one time (optional)', type: 'quantifier' },
    { pattern: /\{(\d+)\}/, explanation: (m) => `Exactly ${m.match(/\d+/)?.[0]} times`, type: 'quantifier' },
    { pattern: /\{(\d+),\}/, explanation: (m) => `${m.match(/\d+/)?.[0]} or more times`, type: 'quantifier' },
    { pattern: /\{(\d+),(\d+)\}/, explanation: (m) => { const nums = m.match(/\d+/g); return `Between ${nums?.[0]} and ${nums?.[1]} times`; }, type: 'quantifier' },

    // Groups
    { pattern: /\((?!\?)/, explanation: () => 'Capturing group', type: 'group' },
    { pattern: /\(\?:/, explanation: () => 'Non-capturing group', type: 'group' },
    { pattern: /\(\?=/, explanation: () => 'Positive lookahead', type: 'group' },
    { pattern: /\(\?!/, explanation: () => 'Negative lookahead', type: 'group' },
    { pattern: /\(\?<=/, explanation: () => 'Positive lookbehind', type: 'group' },
    { pattern: /\(\?<!/, explanation: () => 'Negative lookbehind', type: 'group' },
    { pattern: /\)/, explanation: () => 'End of group', type: 'group' },

    // Character sets
    { pattern: /\[(\^)?/, explanation: (m) => m.includes('^') ? 'Any character NOT in the set' : 'Any character in the set', type: 'class' },
    { pattern: /\]/, explanation: () => 'End of character set', type: 'class' },

    // Operators
    { pattern: /\|/, explanation: () => 'OR (alternation)', type: 'operator' },

    // Escapes
    { pattern: /\\n/, explanation: () => 'Newline character', type: 'escape' },
    { pattern: /\\t/, explanation: () => 'Tab character', type: 'escape' },
    { pattern: /\\r/, explanation: () => 'Carriage return', type: 'escape' },
    { pattern: /\\./, explanation: (m) => `Literal "${m[1]}" character`, type: 'escape' },
];

const TYPE_COLORS: Record<TokenExplanation['type'], string> = {
    quantifier: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    anchor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    group: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    class: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
    escape: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    literal: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
    operator: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
};

export const RegexExplainerTool: React.FC = () => {
    const [regex, setRegex] = useState('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
    const [copied, setCopied] = useState(false);
    const [isValid, setIsValid] = useState(true);

    const explanation = useMemo(() => {
        try {
            new RegExp(regex);
            setIsValid(true);
        } catch {
            setIsValid(false);
            return [];
        }

        const tokens: TokenExplanation[] = [];
        let remaining = regex;
        let position = 0;

        while (remaining.length > 0) {
            let matched = false;

            for (const { pattern, explanation: explain, type } of REGEX_PATTERNS) {
                const match = remaining.match(pattern);
                if (match && match.index === 0) {
                    tokens.push({
                        token: match[0],
                        explanation: explain(match[0]),
                        type,
                    });
                    remaining = remaining.slice(match[0].length);
                    position += match[0].length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Literal character
                const char = remaining[0];
                tokens.push({
                    token: char,
                    explanation: `Literal "${char}"`,
                    type: 'literal',
                });
                remaining = remaining.slice(1);
                position++;
            }
        }

        return tokens;
    }, [regex]);

    const humanReadable = useMemo(() => {
        if (!isValid || explanation.length === 0) return '';

        const parts: string[] = [];
        let i = 0;

        while (i < explanation.length) {
            const token = explanation[i];

            if (token.token === '^') {
                parts.push('The string must start with');
            } else if (token.token === '$') {
                parts.push('and end there');
            } else if (token.type === 'class' && token.token.startsWith('[')) {
                // Find the closing bracket
                let charSet = token.token;
                let j = i + 1;
                while (j < explanation.length && explanation[j].token !== ']') {
                    charSet += explanation[j].token;
                    j++;
                }
                if (j < explanation.length) charSet += ']';
                parts.push(`any character from "${charSet}"`);
                i = j;
            } else if (token.type === 'quantifier') {
                const lastPart = parts.pop();
                parts.push(`${lastPart} (${token.explanation.toLowerCase()})`);
            } else if (token.type === 'escape' || token.type === 'class') {
                parts.push(token.explanation.toLowerCase());
            } else if (token.type === 'operator' && token.token === '|') {
                parts.push('OR');
            } else if (token.type === 'literal') {
                parts.push(`"${token.token}"`);
            } else if (token.type === 'group' && token.token.startsWith('(')) {
                parts.push(`start ${token.explanation.toLowerCase()}`);
            } else if (token.token === ')') {
                parts.push('end group');
            }

            i++;
        }

        return parts.join(' → ');
    }, [explanation, isValid]);

    const copyExplanation = async () => {
        const text = explanation.map(t => `${t.token}: ${t.explanation}`).join('\n');
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Input */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Code className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg text-text-main dark:text-white">Enter Regular Expression</h3>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={regex}
                        onChange={(e) => setRegex(e.target.value)}
                        placeholder="Enter your regex pattern..."
                        className={`w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border-2 ${isValid ? 'border-gray-200 dark:border-white/10' : 'border-red-500'
                            } text-text-main dark:text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                    />
                    {!isValid && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Invalid</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Human Readable */}
            {isValid && humanReadable && (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-3xl p-6 border border-primary/20">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-primary shrink-0 mt-1" />
                        <div>
                            <h4 className="font-bold text-primary mb-2">In Plain English</h4>
                            <p className="text-text-main dark:text-white leading-relaxed">{humanReadable}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Token Breakdown */}
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg text-text-main dark:text-white">Token Breakdown</h3>
                    <button
                        onClick={copyExplanation}
                        disabled={!isValid}
                        className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-text-main dark:text-white font-medium text-sm flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                {isValid && explanation.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {explanation.map((token, i) => (
                            <div
                                key={i}
                                className={`group relative px-3 py-2 rounded-xl border font-mono text-sm cursor-help ${TYPE_COLORS[token.type]}`}
                            >
                                {token.token}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    {token.explanation}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        {isValid ? 'Enter a regex pattern to see the breakdown' : 'Invalid regex pattern'}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4">
                <div className="flex flex-wrap gap-3 justify-center">
                    {Object.entries(TYPE_COLORS).map(([type, colors]) => (
                        <div key={type} className={`px-3 py-1 rounded-lg border text-xs font-medium ${colors}`}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
