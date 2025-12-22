"use client";

import React, { useState } from 'react';

export const JsonTool: React.FC = () => {
  const [input, setInput] = useState('{"name":"NotYourAverage.Tools","type":"Tool Collection","active":true}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError("Invalid JSON: " + (err instanceof Error ? err.message : String(err)));
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput('');
        setError(null);
        return;
      }
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err) {
      setError("Invalid JSON: " + (err instanceof Error ? err.message : String(err)));
      setOutput('');
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-none mx-auto py-6 md:py-8 gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4 shrink-0 px-2 md:px-0">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={minifyJson}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-primary/50 text-text-main dark:text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Minify
          </button>
          <button
            onClick={formatJson}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Format
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full">
        {/* Input */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[500px]">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Raw JSON</span>
            <button
              onClick={() => setInput('')}
              className="text-xs text-primary hover:underline"
            >Clear</button>
          </div>
          <textarea
            className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Paste your JSON here..."
          />
        </div>

        {/* Output */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} shadow-sm overflow-hidden relative min-h-[500px]`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Result</span>
            <button
              onClick={() => { navigator.clipboard.writeText(output) }}
              className="flex items-center gap-1 text-xs text-text-sub hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
            </button>
          </div>

          {error ? (
            <div className="flex-1 p-4 text-red-500 bg-red-50 dark:bg-red-900/10 font-mono text-sm break-all">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-green-400 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
              value={output}
              placeholder="Formatted output will appear here..."
              ref={(el) => {
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

