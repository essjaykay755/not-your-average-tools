"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Copy, Check, HelpCircle, RefreshCw } from 'lucide-react';

interface CronField {
    value: string;
    label: string;
    min: number;
    max: number;
    options: { value: string; label: string }[];
}

const PRESETS = [
    { label: 'Every minute', cron: '* * * * *' },
    { label: 'Every hour', cron: '0 * * * *' },
    { label: 'Every day at midnight', cron: '0 0 * * *' },
    { label: 'Every Monday at 9 AM', cron: '0 9 * * 1' },
    { label: 'Every 1st of month', cron: '0 0 1 * *' },
    { label: 'Every 15 minutes', cron: '*/15 * * * *' },
    { label: 'Every 6 hours', cron: '0 */6 * * *' },
    { label: 'Weekdays at 8 AM', cron: '0 8 * * 1-5' },
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const parseCronPart = (part: string, min: number, max: number): number[] => {
    if (part === '*') {
        return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }

    const result: number[] = [];
    const parts = part.split(',');

    for (const p of parts) {
        if (p.includes('/')) {
            const [range, step] = p.split('/');
            const stepNum = parseInt(step);
            let start = min;
            let end = max;

            if (range !== '*') {
                if (range.includes('-')) {
                    [start, end] = range.split('-').map(Number);
                } else {
                    start = parseInt(range);
                }
            }

            for (let i = start; i <= end; i += stepNum) {
                result.push(i);
            }
        } else if (p.includes('-')) {
            const [start, end] = p.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                result.push(i);
            }
        } else {
            result.push(parseInt(p));
        }
    }

    return result.filter(n => n >= min && n <= max).sort((a, b) => a - b);
};

const getNextRuns = (cronParts: string[], count: number = 5): Date[] => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts;
    const runs: Date[] = [];
    const now = new Date();
    let current = new Date(now);
    current.setSeconds(0);
    current.setMilliseconds(0);

    const minutes = parseCronPart(minute, 0, 59);
    const hours = parseCronPart(hour, 0, 23);
    const daysOfMonth = parseCronPart(dayOfMonth, 1, 31);
    const months = parseCronPart(month, 1, 12);
    const daysOfWeek = parseCronPart(dayOfWeek, 0, 6);

    let iterations = 0;
    const maxIterations = 1000000;

    while (runs.length < count && iterations < maxIterations) {
        iterations++;
        current.setMinutes(current.getMinutes() + 1);

        const m = current.getMinutes();
        const h = current.getHours();
        const dom = current.getDate();
        const mon = current.getMonth() + 1;
        const dow = current.getDay();

        if (
            minutes.includes(m) &&
            hours.includes(h) &&
            months.includes(mon) &&
            (dayOfMonth === '*' || daysOfMonth.includes(dom)) &&
            (dayOfWeek === '*' || daysOfWeek.includes(dow))
        ) {
            runs.push(new Date(current));
        }
    }

    return runs;
};

const describeCron = (cronParts: string[]): string => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cronParts;

    let description = 'Runs ';

    // Time
    if (minute === '*' && hour === '*') {
        description += 'every minute';
    } else if (minute.startsWith('*/')) {
        description += `every ${minute.slice(2)} minutes`;
    } else if (hour === '*') {
        description += `at minute ${minute} of every hour`;
    } else if (minute === '0' && hour === '*') {
        description += 'every hour';
    } else if (hour.startsWith('*/')) {
        description += `every ${hour.slice(2)} hours at minute ${minute}`;
    } else {
        const h = parseInt(hour);
        const m = parseInt(minute);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        description += `at ${displayHour}:${m.toString().padStart(2, '0')} ${period}`;
    }

    // Day of week
    if (dayOfWeek !== '*') {
        if (dayOfWeek.includes('-')) {
            const [start, end] = dayOfWeek.split('-').map(Number);
            description += `, ${DAYS[start]} through ${DAYS[end]}`;
        } else if (dayOfWeek.includes(',')) {
            const days = dayOfWeek.split(',').map(d => DAYS[parseInt(d)]);
            description += `, on ${days.join(', ')}`;
        } else {
            description += `, on ${DAYS[parseInt(dayOfWeek)]}`;
        }
    }

    // Day of month
    if (dayOfMonth !== '*') {
        description += `, on day ${dayOfMonth} of the month`;
    }

    // Month
    if (month !== '*') {
        if (month.includes('-')) {
            const [start, end] = month.split('-').map(Number);
            description += `, ${MONTHS[start - 1]} through ${MONTHS[end - 1]}`;
        } else {
            description += `, in ${MONTHS[parseInt(month) - 1]}`;
        }
    }

    return description + '.';
};

export const CronTool: React.FC = () => {
    const [cronExpression, setCronExpression] = useState('0 * * * *');
    const [copied, setCopied] = useState(false);

    const cronParts = useMemo(() => cronExpression.trim().split(/\s+/), [cronExpression]);
    const isValid = cronParts.length === 5 && cronParts.every(p => /^[\d,\-\*\/]+$/.test(p));

    const description = useMemo(() => {
        if (!isValid) return 'Invalid cron expression';
        try {
            return describeCron(cronParts);
        } catch {
            return 'Invalid cron expression';
        }
    }, [cronParts, isValid]);

    const nextRuns = useMemo(() => {
        if (!isValid) return [];
        try {
            return getNextRuns(cronParts, 5);
        } catch {
            return [];
        }
    }, [cronParts, isValid]);

    const copyExpression = () => {
        navigator.clipboard.writeText(cronExpression);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyPreset = (cron: string) => {
        setCronExpression(cron);
    };

    const updatePart = (index: number, value: string) => {
        const parts = [...cronParts];
        while (parts.length < 5) parts.push('*');
        parts[index] = value;
        setCronExpression(parts.join(' '));
    };

    return (
        <div className="w-full space-y-6">
            {/* Main Input */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                    Cron Expression
                </label>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={cronExpression}
                        onChange={(e) => setCronExpression(e.target.value)}
                        className={`flex-1 bg-gray-50 dark:bg-black/30 rounded-xl px-6 py-4 text-2xl font-mono text-center text-text-main dark:text-white border-2 transition-colors ${isValid
                                ? 'border-green-500/50 focus:border-green-500'
                                : 'border-red-500/50 focus:border-red-500'
                            } outline-none`}
                        placeholder="* * * * *"
                    />
                    <button
                        onClick={copyExpression}
                        className="px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            </div>

            {/* Description */}
            <div className={`rounded-2xl p-6 border ${isValid ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                <div className="flex items-start gap-4">
                    <Clock className={`w-6 h-6 shrink-0 ${isValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                    <p className={`text-lg font-medium leading-relaxed ${isValid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                        {description}
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Field Editors */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                        Field Editor
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Minute', hint: '0-59', index: 0 },
                            { label: 'Hour', hint: '0-23', index: 1 },
                            { label: 'Day of Month', hint: '1-31', index: 2 },
                            { label: 'Month', hint: '1-12', index: 3 },
                            { label: 'Day of Week', hint: '0-6 (Sun-Sat)', index: 4 },
                        ].map(({ label, hint, index }) => (
                            <div key={label} className="flex items-center gap-4">
                                <div className="w-32">
                                    <span className="text-sm font-medium text-text-main dark:text-white">{label}</span>
                                    <span className="text-xs text-gray-400 block">{hint}</span>
                                </div>
                                <input
                                    type="text"
                                    value={cronParts[index] || '*'}
                                    onChange={(e) => updatePart(index, e.target.value)}
                                    className="flex-1 bg-gray-50 dark:bg-black/20 rounded-lg px-4 py-2 text-sm font-mono text-text-main dark:text-white border border-gray-200 dark:border-white/10 outline-none focus:border-primary"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Runs */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <h3 className="font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-gray-400" />
                        Next 5 Runs
                    </h3>
                    {nextRuns.length > 0 ? (
                        <ul className="space-y-3">
                            {nextRuns.map((run, i) => (
                                <li key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-black/20 rounded-xl">
                                    <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-text-main dark:text-white">
                                        {run.toLocaleString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm">Enter a valid cron expression to see upcoming runs.</p>
                    )}
                </div>
            </div>

            {/* Presets */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <h3 className="font-bold text-text-main dark:text-white mb-4">Quick Presets</h3>
                <div className="flex flex-wrap gap-2">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.cron}
                            onClick={() => applyPreset(preset.cron)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${cronExpression === preset.cron
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 dark:bg-black/20 text-text-main dark:text-white hover:bg-gray-200 dark:hover:bg-black/40'
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Cheat Sheet */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6 overflow-hidden">
                <h3 className="text-white font-bold mb-4">Cron Syntax Cheat Sheet</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
                    <div className="space-y-2 text-gray-300">
                        <p><span className="text-yellow-400">*</span> — any value</p>
                        <p><span className="text-yellow-400">,</span> — value list separator</p>
                        <p><span className="text-yellow-400">-</span> — range of values</p>
                        <p><span className="text-yellow-400">/</span> — step values</p>
                    </div>
                    <div className="space-y-2 text-gray-300">
                        <p><span className="text-green-400">*/15</span> — every 15 units</p>
                        <p><span className="text-green-400">1,15</span> — at 1 and 15</p>
                        <p><span className="text-green-400">1-5</span> — from 1 to 5</p>
                        <p><span className="text-green-400">0 9 * * 1-5</span> — weekdays at 9 AM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
