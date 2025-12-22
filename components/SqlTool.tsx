"use client";

import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-sql';
import { Play, Database, Trash2, RefreshCcw, Table as TableIcon } from 'lucide-react';

declare global {
    interface Window {
        initSqlJs: any;
    }
}

export const SqlTool: React.FC = () => {
    const [db, setDb] = useState<any>(null);
    const [query, setQuery] = useState(`SELECT * FROM users;`);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [schema, setSchema] = useState<string[]>([]);

    useEffect(() => {
        const loadSqlJs = async () => {
            if (window.initSqlJs) {
                initializeDb();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
            script.async = true;
            script.onload = async () => {
                initializeDb();
            };
            document.body.appendChild(script);
        };

        loadSqlJs();
    }, []);

    const initializeDb = async () => {
        try {
            const SQL = await window.initSqlJs({
                locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });
            const newDb = new SQL.Database();

            // Seed Data with MORE columns
            newDb.run(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY, 
                    name TEXT, 
                    email TEXT, 
                    role TEXT, 
                    status TEXT, 
                    joined_date TEXT, 
                    credits INTEGER,
                    bio TEXT
                );
                INSERT INTO users VALUES (1, 'Alice Johnson', 'alice@example.com', 'Admin', 'Active', '2023-01-15', 500, 'Loves coding and coffee.');
                INSERT INTO users VALUES (2, 'Bob Smith', 'bob@example.com', 'User', 'Inactive', '2023-03-22', 120, 'Casual browser.');
                INSERT INTO users VALUES (3, 'Charlie Brown', 'charlie@example.com', 'User', 'Active', '2023-06-10', 350, 'Daily visitor.');
                INSERT INTO users VALUES (4, 'Diana Prince', 'diana@example.com', 'Editor', 'Away', '2023-08-05', 1000, 'Content creator extraordinaire.');
                
                CREATE TABLE orders (
                    id INTEGER PRIMARY KEY, 
                    user_id INTEGER, 
                    amount DECIMAL, 
                    currency TEXT,
                    status TEXT, 
                    product_name TEXT,
                    shipping_address TEXT,
                    ordered_at TEXT
                );
                INSERT INTO orders VALUES (101, 1, 99.99, 'USD', 'Completed', 'Premium Plan (1 Year)', '123 Main St, NY', '2023-11-01 10:30:00');
                INSERT INTO orders VALUES (102, 2, 45.50, 'USD', 'Pending', 'E-book Bundle', '456 Oak Dr, CA', '2023-11-05 14:15:00');
                INSERT INTO orders VALUES (103, 1, 120.00, 'EUR', 'Shipped', 'Merch Pack', '123 Main St, NY', '2023-11-10 09:20:00');
                INSERT INTO orders VALUES (104, 3, 15.00, 'USD', 'Refunded', 'Sticker Pack', '789 Pine Ln, TX', '2023-11-12 16:45:00');
            `);

            setDb(newDb);
            setSchema(['users', 'orders']);
            setIsLoading(false);

            // Run initial query
            const res = newDb.exec("SELECT * FROM users");
            setResults(res);
        } catch (err: any) {
            setError("Failed to initialize database: " + err.message);
            setIsLoading(false);
        }
    };

    const runQuery = () => {
        if (!db) return;
        setError(null);
        try {
            const res = db.exec(query);
            setResults(res);
            if (res.length === 0 && !query.trim().toLowerCase().startsWith('select')) {
                setError("Query executed successfully (No rows returned).");
            } else if (res.length === 0) {
                setResults([]); // Empty Select
            }
        } catch (err: any) {
            setError(err.message);
            setResults([]);
        }
    };

    const resetDb = () => {
        setIsLoading(true);
        if (db) db.close();
        initializeDb();
    };

    return (
        <div className="w-full flex flex-col xl:flex-row gap-6 items-start min-h-[600px]">

            {/* Left: Editor & Results (Expanded Width) */}
            <div className="flex-1 w-full flex flex-col gap-6 min-w-0">

                {/* Editor Container */}
                <div className="bg-[#1e1e1e] rounded-3xl overflow-hidden shadow-xl border border-gray-800 flex flex-col min-h-[300px]">
                    <div className="bg-[#2d2d2d] px-6 py-3 border-b border-gray-700 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider">
                            <Database className="w-4 h-4" />
                            SQL Editor
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={resetDb}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Reset Database"
                            >
                                <RefreshCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setQuery('')}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Clear Editor"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative font-mono text-sm group">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 gap-2">
                                <RefreshCcw className="w-5 h-5 animate-spin" />
                                Loading Engine...
                            </div>
                        ) : (
                            <Editor
                                value={query}
                                onValueChange={code => setQuery(code)}
                                highlight={code => highlight(code, languages.sql, 'sql')}
                                padding={24}
                                className="prism-editor min-h-[300px]"
                                textareaClassName="focus:outline-none"
                                style={{
                                    fontFamily: '"Fira Code", "Fira Mono", monospace',
                                    fontSize: 15,
                                    backgroundColor: '#1e1e1e',
                                    color: '#d4d4d4',
                                    minHeight: '300px',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-400 italic">
                        Tip: Press Run Query to execute.
                    </div>
                    <button
                        onClick={runQuery}
                        disabled={isLoading}
                        className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Run Query
                    </button>
                </div>

                {/* Results Area (Full Width Fix) */}
                <div className="w-full bg-white dark:bg-surface-dark rounded-3xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[200px]">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 text-sm font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center bg-gray-50/50 dark:bg-white/5">
                        <span>Results</span>
                        {results.length > 0 && <span className="text-primary normal-case bg-primary/10 px-3 py-1 rounded-full text-xs font-bold">{results[0].values.length} rows</span>}
                    </div>

                    <div className="w-full overflow-x-auto">
                        {error ? (
                            <div className="p-6 text-red-500 font-mono text-sm bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500">
                                {error}
                            </div>
                        ) : results.length > 0 ? (
                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                <thead className="bg-gray-50/80 dark:bg-white/5">
                                    <tr>
                                        {results[0].columns.map((col: string, i: number) => (
                                            <th key={i} className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 select-none">
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {results[0].values.map((row: any[], i: number) => (
                                        <tr key={i} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            {row.map((cell: any, j: number) => (
                                                <td key={j} className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono group-hover:text-black dark:group-hover:text-white transition-colors">
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="p-6 rounded-full bg-gray-50 dark:bg-white/5">
                                    <TableIcon className="w-8 h-8 opacity-20" />
                                </div>
                                <p>No results to display</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right: Schema / Info (Fixed Width) */}
            <div className="w-full xl:w-[280px] shrink-0 flex flex-col gap-6">
                <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5 shadow-sm sticky top-6">
                    <h3 className="font-bold text-lg text-text-main dark:text-white mb-4 border-b border-gray-100 dark:border-white/5 pb-4">
                        Schema
                    </h3>
                    <div className="flex flex-col gap-3">
                        {schema.map(table => (
                            <div
                                key={table}
                                className="group cursor-pointer p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                onClick={() => setQuery(`SELECT * FROM ${table} LIMIT 10;`)}
                            >
                                <div className="flex items-center gap-2 text-primary font-bold mb-1">
                                    <TableIcon className="w-4 h-4" />
                                    {table}
                                </div>
                                <div className="text-[10px] text-gray-400 pl-6 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                                    Click to Query
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
                            <strong className="block mb-2 text-blue-900 dark:text-blue-100">Private & Secure</strong>
                            Your data never leaves this browser tab. Refreshing will reset the database.
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
