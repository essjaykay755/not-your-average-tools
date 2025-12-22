"use client";

import React, { useState, useMemo } from 'react';

export const RegexTool: React.FC = () => {
  const [regexStr, setRegexStr] = useState('([A-Z])\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World. This is a Regex Test for NotYourAverage.Tools.');

  const result = useMemo(() => {
    if (!regexStr) return { matches: [], error: null };

    try {
      const regex = new RegExp(regexStr, flags);
      const parts = [];
      let lastIndex = 0;
      let match;

      // We need to use a loop for global matches or exec for single
      if (!flags.includes('g')) {
        const m = regex.exec(testString);
        if (m) {
          parts.push({ text: testString.slice(0, m.index), match: false });
          parts.push({ text: m[0], match: true });
          parts.push({ text: testString.slice(m.index + m[0].length), match: false });
        } else {
          parts.push({ text: testString, match: false });
        }
        return { matches: parts, count: m ? 1 : 0, error: null };
      }

      // For global
      while ((match = regex.exec(testString)) !== null) {
        if (match.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, match.index), match: false });
        }
        parts.push({ text: match[0], match: true });
        lastIndex = match.index + match[0].length;

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), match: false });
      }

      return { matches: parts, count: (testString.match(regex) || []).length, error: null };

    } catch (e) {
      return { matches: [{ text: testString, match: false }], count: 0, error: (e as Error).message };
    }
  }, [regexStr, flags, testString]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-none mx-auto p-4 md:p-8 gap-6">

      <div className="flex flex-col gap-6 h-full">
        {/* Regex Input */}
        <div className="flex flex-col md:flex-row gap-2 shrink-0">
          <div className="flex-1 flex items-center bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm h-12">
            <span className="px-3 text-gray-400 font-mono text-lg select-none">/</span>
            <input
              type="text"
              className="flex-1 h-full bg-transparent outline-none font-mono text-text-main dark:text-white"
              value={regexStr}
              onChange={(e) => setRegexStr(e.target.value)}
              placeholder="Enter regex pattern..."
            />
            <span className="px-3 text-gray-400 font-mono text-lg select-none">/</span>
          </div>
          <input
            type="text"
            className="w-24 h-12 px-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg outline-none font-mono text-text-main dark:text-white focus:border-primary focus:ring-1 focus:ring-primary shadow-sm text-center"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="flags"
          />
        </div>

        {/* Error Message */}
        {result.error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg font-mono shrink-0">
            Error: {result.error}
          </div>
        )}

        <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full">
          {/* Test String Input */}
          <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Test String</span>
            </div>
            <textarea
              className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
              value={testString}
              onChange={(e) => {
                setTestString(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              placeholder="Enter test string here..."
            />
          </div>

          {/* Match Output */}
          <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[500px]">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex justify-between items-center shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Matches</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{result.count || 0} found</span>
            </div>
            <div className="flex-1 w-full h-full p-4 bg-transparent text-text-main dark:text-gray-300 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
              {result.matches.length > 0 ? result.matches.map((part, i) => (
                part.match ? (
                  <span key={i} className="bg-primary/20 text-primary dark:bg-primary/40 dark:text-white rounded px-0.5 border-b-2 border-primary">{part.text}</span>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )) : (
                <span className="text-gray-400 italic">No matches...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

