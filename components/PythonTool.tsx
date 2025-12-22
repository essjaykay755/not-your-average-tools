"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css'; // Importing a built-in theme if available, otherwise we'll add styles

declare global {
    interface Window {
        loadPyodide: any;
        pyodide: any;
    }
}

export const PythonTool: React.FC = () => {
    const [code, setCode] = useState<string>(`# Write your Python code here
print("Hello, World!")

def add(a, b):
    return a + b

print(f"2 + 3 = {add(2, 3)}")`);
    const [output, setOutput] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [isPyodideReady, setIsPyodideReady] = useState<boolean>(false);
    const consoleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPyodideScript = async () => {
            if (window.pyodide) {
                setIsPyodideReady(true);
                setIsLoading(false);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
            script.async = true;
            script.onload = async () => {
                try {
                    outputLog("Loading Python environment...");
                    window.pyodide = await window.loadPyodide();
                    // Redirect stdout to our local output
                    await window.pyodide.runPythonAsync(`
            import sys
            import io
            sys.stdout = io.StringIO()
          `);
                    outputLog("Python Ready!");
                    setIsPyodideReady(true);
                } catch (error) {
                    console.error("Pyodide failed to load:", error);
                    outputLog("Error: Failed to load Python environment.");
                } finally {
                    setIsLoading(false);
                }
            };
            document.body.appendChild(script);
        };

        loadPyodideScript();
    }, []);

    const outputLog = (text: string, isError: boolean = false) => {
        setOutput(prev => [...prev, isError ? `Error: ${text}` : text]);
        setTimeout(() => scrollToBottom(), 100);
    };

    const scrollToBottom = () => {
        if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
    };

    const clearOutput = () => {
        setOutput([]);
    };

    const runCode = async () => {
        if (!isPyodideReady || isRunning) return;

        setIsRunning(true);
        outputLog(`>>> Running...`);

        try {
            // Reset stdout buffer
            await window.pyodide.runPythonAsync('sys.stdout = io.StringIO()');

            // Run user code
            await window.pyodide.runPythonAsync(code);

            // Get stdout content
            const stdout = await window.pyodide.runPythonAsync('sys.stdout.getvalue()');

            if (stdout) {
                // Split lines to handle basic newlines since stdout is one big string
                const lines = stdout.split('\n');
                lines.forEach((line: string) => {
                    if (line) outputLog(line);
                });
            }

        } catch (error: any) {
            outputLog(error.toString(), true);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="w-full h-full min-h-[600px] flex flex-col gap-4">
            {/* Prism Styles Override for our custom editor look */}
            <style jsx global>{`
        .prism-editor {
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            background-color: #1e1e1e;
            color: #d4d4d4;
            min-height: 100%;
        }
        .prism-editor textarea {
            outline: none !important;
        }
        /* Token Colors (Dracula-ish) */
        .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6272a4; }
        .token.punctuation { color: #f8f8f2; }
        .token.namespace { opacity: .7; }
        .token.property, .token.tag, .token.constant, .token.symbol, .token.deleted { color: #ff79c6; }
        .token.boolean, .token.number { color: #bd93f9; }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #f1fa8c; }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #8be9fd; }
        .token.atrule, .token.attr-value, .token.keyword { color: #ff79c6; }
        .token.function, .token.class-name { color: #50fa7b; }
        .token.regex, .token.important, .token.variable { color: #ffb86c; }
      `}</style>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white dark:bg-surface-dark p-4 rounded-xl border border-gray-200 dark:border-white/10 shadow-sm shrink-0">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-lg text-text-main dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#FACC15]">terminal</span>
                        Python Shell
                    </h2>
                    {isLoading && <span className="text-xs text-gray-500 animate-pulse ml-2">Loading core...</span>}
                    {isPyodideReady && !isLoading && <span className="text-[10px] font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Ready</span>}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={clearOutput}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                    >
                        Clear Output
                    </button>
                    <button
                        onClick={runCode}
                        disabled={!isPyodideReady || isRunning}
                        className={`flex items-center gap-2 px-6 py-2 text-sm font-bold text-black rounded-lg transition-all shadow-md active:scale-95 ${!isPyodideReady || isRunning
                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                : 'bg-[#FACC15] hover:brightness-110'
                            }`}
                    >
                        <span className="material-symbols-outlined icon-sm">play_arrow</span>
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>

            {/* Editor & Console Split */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">

                {/* Editor */}
                <div className="relative flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden shadow-sm border border-gray-800">
                    <div className="px-4 py-2 bg-[#2d2d2d] border-b border-gray-800 flex justify-between items-center text-xs text-gray-400 font-mono">
                        <span>main.py</span>
                        <span>Python 3.11</span>
                    </div>
                    <div className="flex-1 overflow-auto relative">
                        <Editor
                            value={code}
                            onValueChange={code => setCode(code)}
                            highlight={code => highlight(code, languages.python, 'python')}
                            padding={16}
                            className="prism-editor"
                            textareaClassName="focus:outline-none"
                            style={{
                                fontFamily: '"Fira Code", "Fira Mono", monospace',
                                fontSize: 14,
                                minHeight: '100%',
                            }}
                        />
                    </div>
                </div>

                {/* Console */}
                <div className="flex flex-col bg-black rounded-xl overflow-hidden shadow-sm border border-gray-800">
                    <div className="px-4 py-2 bg-[#1a1a1a] border-b border-gray-800 flex justify-between items-center text-xs text-gray-500 font-mono">
                        <span>Console Output</span>
                        {isRunning && <span className="animate-pulse text-green-500">Executing...</span>}
                    </div>
                    <div ref={consoleRef} className="flex-1 p-4 font-mono text-sm overflow-y-auto font-medium">
                        {output.map((line, i) => (
                            <div key={i} className={`mb-1 break-words ${line.startsWith('Error:') ? 'text-red-400' : 'text-green-400'}`}>
                                {line.startsWith('>>>') ? <span className="text-gray-500 mr-2">{line}</span> : line}
                            </div>
                        ))}
                        {output.length === 0 && <div className="text-gray-600 italic">Output will appear here...</div>}

                    </div>
                </div>

            </div>
        </div>
    );
};
