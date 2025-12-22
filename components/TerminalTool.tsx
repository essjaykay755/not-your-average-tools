"use client";

import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { TerminalSquare, X, Maximize2, Minus } from 'lucide-react';

interface FileSystem {
    [key: string]: FileSystem | string;
}

interface CommandHistory {
    command: string;
    output: React.ReactNode;
    path: string;
}

const BOOT_SEQUENCE = [
    "Initializing Kernel...",
    "Loading Virtual File System...",
    "Mounting /home/guest...",
    "Starting Shell...",
    "Welcome to WebTerm v1.0.0"
];

const DEFAULT_FS: FileSystem = {
    "home": {
        "guest": {
            "documents": {
                "todo.txt": "1. Buy milk\n2. Conquer the world\n3. Learn Linux",
                "project_ideas.md": "# Cool App Ideas\n- AI Toaster\n- Blockchain for Cats"
            },
            "downloads": {},
            "pictures": {
                "cat.txt": "  /\\_/\\\n ( o.o )\n  > ^ <"
            },
            "readme.txt": "Welcome to this interactive terminal!\nTry running 'help' to see available commands."
        }
    },
    "var": {
        "log": {
            "syslog": "System initialized successfully."
        }
    },
    "etc": {
        "passwd": "root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:guest:/home/guest:/bin/bash"
    },
    "usr": {
        "bin": {}
    }
};

export const TerminalTool: React.FC = () => {
    // State
    const [history, setHistory] = useState<CommandHistory[]>([]);
    const [input, setInput] = useState('');
    const [fs, setFs] = useState<FileSystem>(DEFAULT_FS);
    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'guest']);
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isBooting, setIsBooting] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true;
        const playBoot = async () => {
            if (containerRef.current) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
            for (const line of BOOT_SEQUENCE) {
                if (!isMounted) return;
                await new Promise(r => setTimeout(r, 600));
                if (!isMounted) return;
                setHistory(prev => [...prev, { command: '', output: <span className="text-gray-400">{line}</span>, path: '' }]);
            }
            if (isMounted) {
                setIsBooting(false);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
        };

        playBoot();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history, isBooting]);

    const resolvePath = (pathParts: string[]): FileSystem | string | null => {
        let current: any = fs;
        for (const part of pathParts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                return null;
            }
        }
        return current;
    };

    const getDir = (pathParts: string[]): FileSystem | null => {
        const item = resolvePath(pathParts);
        return (typeof item === 'object') ? item : null;
    };

    const handleCommand = (cmdString: string) => {
        const trimmed = cmdString.trim();
        if (!trimmed) {
            setHistory(prev => [...prev, { command: '', output: null, path: `/${currentPath.join('/')}` }]);
            return;
        }

        const [cmd, ...args] = trimmed.split(/\s+/);
        const fullCmd = { command: trimmed, output: null as React.ReactNode, path: `/${currentPath.join('/')}` };

        // Update shell history for Up/Down arrow
        setCommandHistory(prev => [...prev, trimmed]);
        setHistoryIndex(-1);

        switch (cmd) {
            case 'help':
                fullCmd.output = (
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        <div><span className="text-yellow-400">ls</span> - List files</div>
                        <div><span className="text-yellow-400">cd [dir]</span> - Change directory</div>
                        <div><span className="text-yellow-400">mkdir [name]</span> - Create directory</div>
                        <div><span className="text-yellow-400">touch [name]</span> - Create file</div>
                        <div><span className="text-yellow-400">rm [name]</span> - Remove file/dir</div>
                        <div><span className="text-yellow-400">cat [file]</span> - contents</div>
                        <div><span className="text-yellow-400">pwd</span> - Print working directory</div>
                        <div><span className="text-yellow-400">echo [text]</span> - Display text</div>
                        <div><span className="text-yellow-400">clear</span> - Clear terminal</div>
                        <div><span className="text-yellow-400">whoami</span> - Current user</div>
                        <div><span className="text-yellow-400">date</span> - Current time</div>
                        <div><span className="text-yellow-400">neofetch</span> - System info</div>
                    </div>
                );
                break;

            case 'clear':
                setHistory([]);
                return; // Special case, don't add to history view

            case 'whoami':
                fullCmd.output = "guest";
                break;

            case 'pwd':
                fullCmd.output = "/" + currentPath.join('/');
                break;

            case 'date':
                fullCmd.output = new Date().toString();
                break;

            case 'ls': {
                const targetDir = getDir(currentPath);
                if (targetDir) {
                    fullCmd.output = (
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(targetDir).map(([name, content]) => (
                                <span key={name} className={typeof content === 'object' ? 'text-blue-400 font-bold' : 'text-white'}>
                                    {name}{typeof content === 'object' ? '/' : ''}
                                </span>
                            ))}
                        </div>
                    );
                }
                break;
            }

            case 'cd': {
                const target = args[0];
                if (!target || target === '~') {
                    setCurrentPath(['home', 'guest']);
                } else if (target === '..') {
                    if (currentPath.length > 0) {
                        setCurrentPath(prev => prev.slice(0, -1));
                    }
                } else if (target === '/') {
                    setCurrentPath([]);
                } else {
                    // Basic relative path support
                    const newPath = [...currentPath, target];
                    if (getDir(newPath)) {
                        setCurrentPath(newPath);
                    } else {
                        fullCmd.output = `cd: ${target}: No such file or directory`;
                    }
                }
                break;
            }

            case 'mkdir': {
                const name = args[0];
                if (!name) { fullCmd.output = "mkdir: missing operand"; break; }
                const currentDir = getDir(currentPath);
                if (currentDir && !(name in currentDir)) {
                    currentDir[name] = {};
                    setFs({ ...fs }); // Trigger re-render
                } else {
                    fullCmd.output = `mkdir: cannot create directory '${name}': File exists`;
                }
                break;
            }

            case 'touch': {
                const name = args[0];
                if (!name) { fullCmd.output = "touch: missing file operand"; break; }
                const currentDir = getDir(currentPath);
                if (currentDir && !(name in currentDir)) {
                    currentDir[name] = "";
                    setFs({ ...fs });
                }
                break;
            }

            case 'rm': {
                const name = args[0];
                if (!name) { fullCmd.output = "rm: missing operand"; break; }
                const currentDir = getDir(currentPath);
                if (currentDir && name in currentDir) {
                    delete currentDir[name];
                    setFs({ ...fs });
                } else {
                    fullCmd.output = `rm: cannot remove '${name}': No such file or directory`;
                }
                break;
            }

            case 'cat': {
                const name = args[0];
                if (!name) { fullCmd.output = "cat: missing file"; break; }
                const item = resolvePath([...currentPath, name]);
                if (typeof item === 'string') {
                    fullCmd.output = <pre className="whitespace-pre-wrap font-mono">{item}</pre>;
                } else if (typeof item === 'object') {
                    fullCmd.output = `cat: ${name}: Is a directory`;
                } else {
                    fullCmd.output = `cat: ${name}: No such file or directory`;
                }
                break;
            }

            case 'echo':
                fullCmd.output = args.join(' ');
                break;

            case 'neofetch':
                fullCmd.output = (
                    <div className="flex gap-4 font-mono text-sm">
                        <div className="text-primary hidden sm:block">
                            {`
       /\\
      /  \\
     / /\\ \\
    / /  \\ \\
   / /    \\ \\
  / /      \\ \\
  \\/        \\/
                            `}
                        </div>
                        <div className="flex flex-col">
                            <div><span className="text-primary font-bold">guest</span>@<span className="text-primary font-bold">webterm</span></div>
                            <div>----------------</div>
                            <div><span className="text-yellow-400">OS</span>: WebOS v1.0</div>
                            <div><span className="text-yellow-400">Host</span>: Browser (Chrome/V8)</div>
                            <div><span className="text-yellow-400">Kernel</span>: React 18</div>
                            <div><span className="text-yellow-400">Uptime</span>: Just now</div>
                            <div><span className="text-yellow-400">Shell</span>: ZSH (Simulated)</div>
                            <div><span className="text-yellow-400">CPU</span>: Virtual Core</div>
                            <div><span className="text-yellow-400">Memory</span>: Infinite</div>
                            <div className="flex gap-1 mt-2">
                                <div className="w-3 h-3 bg-black"></div>
                                <div className="w-3 h-3 bg-red-500"></div>
                                <div className="w-3 h-3 bg-green-500"></div>
                                <div className="w-3 h-3 bg-yellow-500"></div>
                                <div className="w-3 h-3 bg-blue-500"></div>
                                <div className="w-3 h-3 bg-purple-500"></div>
                                <div className="w-3 h-3 bg-cyan-500"></div>
                                <div className="w-3 h-3 bg-white"></div>
                            </div>
                        </div>
                    </div>
                );
                break;

            case 'sudo':
                fullCmd.output = "guest is not in the sudoers file. This incident will be reported.";
                break;

            case 'matrix':
                fullCmd.output = <span className="text-green-500 animate-pulse">Running Matrix Simulation... (Press Ctrl+C to stop - just kidding, implementation pending)</span>;
                break;

            default:
                fullCmd.output = `${cmd}: command not found`;
        }

        setHistory(prev => [...prev, fullCmd]);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput('');
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            // Autocomplete logic could go here
        }
    };

    return (
        <div className="w-full h-[80vh] bg-[#0c0c0c] rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col font-mono text-sm md:text-base">

            {/* Window Bar */}
            <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                    <div className="flex gap-2 mr-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/50"></div>
                    </div>
                    <TerminalSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-400 text-xs font-bold">guest@webterm:~</span>
                </div>
                <div className="text-gray-600 text-xs">/bin/bash</div>
            </div>

            {/* Terminal Area */}
            <div
                ref={containerRef}
                className="flex-1 p-4 overflow-y-auto text-gray-300 font-medium custom-scrollbar"
                onClick={() => inputRef.current?.focus()}
            >
                {/* History */}
                {history.map((entry, i) => (
                    <div key={i} className="mb-1">
                        {entry.command && (
                            <div className="flex flex-wrap items-center">
                                <span className="text-green-500 mr-2">guest@webterm:{entry.path}$</span>
                                <span className="text-white">{entry.command}</span>
                            </div>
                        )}
                        {entry.output && (
                            <div className="mt-1 mb-2 text-gray-300 break-words whitespace-pre-wrap">
                                {entry.output}
                            </div>
                        )}
                    </div>
                ))}

                {/* Input Line */}
                {!isBooting && (
                    <div className="flex items-center">
                        <span className="text-green-500 mr-2 shrink-0">guest@webterm:/{currentPath.join('/')}$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-white w-full caret-white"
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </div>
                )}

                <div />
            </div>
        </div>
    );
};
