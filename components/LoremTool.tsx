"use client";

import React, { useState } from 'react';

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "ut", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "ut", "aliquip", "ex", "ea",
  "commodo", "consequat", "duis", "aute", "irure", "dolor", "in", "reprehenderit",
  "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat", "nulla",
  "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident",
  "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

export const LoremTool: React.FC = () => {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [output, setOutput] = useState('');

  const generate = () => {
    let result = [];

    if (type === 'words') {
      for (let i = 0; i < count; i++) {
        result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
      }
      setOutput(result.join(' '));
      return;
    }

    const genSentence = () => {
      const len = 5 + Math.floor(Math.random() * 10);
      let sent = [];
      for (let i = 0; i < len; i++) sent.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
      let str = sent.join(' ');
      return str.charAt(0).toUpperCase() + str.slice(1) + '.';
    };

    if (type === 'sentences') {
      for (let i = 0; i < count; i++) result.push(genSentence());
      setOutput(result.join(' '));
      return;
    }

    if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        const numSentences = 3 + Math.floor(Math.random() * 4);
        let para = [];
        for (let j = 0; j < numSentences; j++) para.push(genSentence());
        result.push(para.join(' '));
      }
      setOutput(result.join('\n\n'));
    }
  };

  return (
    <div className="flex flex-col lg:h-[calc(100vh-140px)] w-full max-w-none mx-auto p-4 md:p-8 gap-6">

      <div className="flex flex-col md:flex-row gap-6 h-full lg:overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
          <div className="p-6 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">Count</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value)))}
                className="w-full p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg outline-none focus:border-primary transition-all text-text-main dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-text-main dark:text-white mb-2">Type</label>
              <div className="flex flex-col gap-2">
                {['paragraphs', 'sentences', 'words'].map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50 dark:hover:bg-white/5">
                    <input
                      type="radio"
                      name="type"
                      checked={type === t}
                      onChange={() => setType(t as any)}
                      className="accent-primary"
                    />
                    <span className="capitalize text-sm text-text-main dark:text-gray-300">{t}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold shadow-sm transition-colors mt-2"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden relative min-h-[400px] lg:min-h-0">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Output</span>
            <button
              onClick={() => { navigator.clipboard.writeText(output) }}
              className="flex items-center gap-1 text-xs text-text-sub hover:text-primary transition-colors"
              disabled={!output}
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
            </button>
          </div>
          <textarea
            readOnly
            className="flex-1 w-full h-full p-6 resize-none bg-transparent text-text-main dark:text-gray-300 focus:outline-none font-serif text-base leading-relaxed"
            value={output}
            placeholder="Generated text will appear here..."
          />
        </div>
      </div>
    </div>
  );
};

