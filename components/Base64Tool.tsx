"use client";

import React, { useState } from 'react';

type Mode = 'encode' | 'decode';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const process = (value: string, currentMode: Mode) => {
    setInput(value);
    setError(null);
    if (!value) {
      setOutput('');
      return;
    }

    try {
      if (currentMode === 'encode') {
        setOutput(btoa(value));
      } else {
        setOutput(atob(value));
      }
    } catch (err) {
      setError("Invalid input for " + currentMode);
      setOutput('');
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput(output); // Swap input/output for convenience
    process(output, newMode);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-140px)] w-full max-w-none mx-auto p-4 md:p-8 gap-6">
      <div className="flex items-center justify-end shrink-0">

        <div className="flex bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-lg p-1">
          <button
            onClick={() => handleModeChange('encode')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'encode'
              ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
              : 'text-gray-500 hover:text-text-main dark:text-gray-400 dark:hover:text-white'
              }`}
          >
            Encode
          </button>
          <button
            onClick={() => handleModeChange('decode')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${mode === 'decode'
              ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
              : 'text-gray-500 hover:text-text-main dark:text-gray-400 dark:hover:text-white'
              }`}
          >
            Decode
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full">
        {/* Input */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden min-h-[500px]">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
            </span>
            <button
              onClick={() => process('', mode)}
              className="text-xs text-primary hover:underline"
            >Clear</button>
          </div>
          <textarea
            className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
            value={input}
            onChange={(e) => {
              process(e.target.value, mode);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder={mode === 'encode' ? "Type text to encode..." : "Paste Base64 to decode..."}
          />
        </div>

        {/* Output */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border ${error ? 'border-red-500' : 'border-gray-200 dark:border-white/10'} shadow-sm overflow-hidden relative min-h-[500px]`}>
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Result</span>
            <button
              onClick={() => { navigator.clipboard.writeText(output) }}
              className="flex items-center gap-1 text-xs text-text-sub hover:text-primary transition-colors"
              disabled={!output}
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
            </button>
          </div>

          {error ? (
            <div className="flex-1 p-4 text-red-500 bg-red-50 dark:bg-red-900/10 font-mono text-sm">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              className="flex-1 w-full h-full p-4 resize-none bg-transparent text-text-main dark:text-green-400 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
              value={output}
              placeholder="Result will appear here..."
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

