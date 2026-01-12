"use client";

import React, { useState } from "react";
import { Play, Copy, Check, AlertCircle, CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react";

interface ApiResult {
    success: boolean;
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    body?: string;
    error?: string;
    responseTime?: number;
}

interface Header {
    key: string;
    value: string;
    enabled: boolean;
}

export const CorsTool: React.FC = () => {
    const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState<Header[]>([
        { key: "Content-Type", value: "application/json", enabled: true }
    ]);
    const [requestBody, setRequestBody] = useState("");
    const [result, setResult] = useState<ApiResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'response'>('headers');

    const addHeader = () => {
        setHeaders([...headers, { key: "", value: "", enabled: true }]);
    };

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
        const newHeaders = [...headers];
        newHeaders[index] = { ...newHeaders[index], [field]: value };
        setHeaders(newHeaders);
    };

    const sendRequest = async () => {
        if (!url.trim()) return;
        setIsLoading(true);
        setResult(null);
        setActiveTab('response');
        const startTime = performance.now();

        try {
            const headerObj: Record<string, string> = {};
            headers.filter(h => h.enabled && h.key).forEach(h => {
                headerObj[h.key] = h.value;
            });

            const options: RequestInit = {
                method,
                headers: headerObj,
                mode: 'cors'
            };

            if (['POST', 'PUT', 'PATCH'].includes(method) && requestBody.trim()) {
                options.body = requestBody;
            }

            const response = await fetch(url, options);
            const endTime = performance.now();

            const responseHeaders: Record<string, string> = {};
            response.headers.forEach((value, key) => { responseHeaders[key] = value; });

            let body = '';
            try {
                body = await response.text();
                // Try to prettify JSON
                try {
                    const json = JSON.parse(body);
                    body = JSON.stringify(json, null, 2);
                } catch { /* Not JSON, keep as is */ }
            } catch { body = '[Unable to read response body]'; }

            setResult({
                success: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                body,
                responseTime: Math.round(endTime - startTime)
            });
        } catch (error: unknown) {
            const endTime = performance.now();
            let errorMessage = 'Unknown error';
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                errorMessage = 'Request failed: CORS blocked or network error. The server may not allow cross-origin requests.';
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setResult({ success: false, error: errorMessage, responseTime: Math.round(endTime - startTime) });
        } finally {
            setIsLoading(false);
        }
    };

    const copyResponse = () => {
        if (!result?.body) return;
        navigator.clipboard.writeText(result.body);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStatusColor = (status?: number) => {
        if (!status) return 'text-gray-500';
        if (status >= 200 && status < 300) return 'text-green-500';
        if (status >= 300 && status < 400) return 'text-blue-500';
        if (status >= 400 && status < 500) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6">
            {/* URL Bar */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-gray-100 dark:border-white/10">
                <div className="flex gap-2">
                    <div className="relative">
                        <select value={method} onChange={(e) => setMethod(e.target.value)}
                            className={`appearance-none w-28 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-3 pr-8 font-bold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 dark:[color-scheme:dark] ${method === 'GET' ? 'text-green-600 dark:text-green-400' :
                                method === 'POST' ? 'text-yellow-600 dark:text-yellow-400' :
                                    method === 'PUT' ? 'text-blue-600 dark:text-blue-400' :
                                        method === 'PATCH' ? 'text-orange-600 dark:text-orange-400' :
                                            method === 'DELETE' ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'
                                }`}>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="PATCH">PATCH</option>
                            <option value="DELETE">DELETE</option>
                            <option value="OPTIONS">OPTIONS</option>
                            <option value="HEAD">HEAD</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendRequest()}
                        placeholder="https://api.example.com/endpoint"
                        className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                    <button onClick={sendRequest} disabled={isLoading || !url.trim()}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        Send
                    </button>
                </div>
            </div>

            {/* Tabs for Headers / Body / Response */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-white/5 rounded-xl w-fit">
                <button onClick={() => setActiveTab('headers')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'headers'
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500'}`}>
                    Headers ({headers.filter(h => h.enabled && h.key).length})
                </button>
                <button onClick={() => setActiveTab('body')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'body'
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500'}`}>
                    Body
                </button>
                <button onClick={() => setActiveTab('response')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'response'
                        ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500'}`}>
                    Response
                    {result && (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${result.success ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                            {result.status || 'ERR'}
                        </span>
                    )}
                </button>
            </div>

            {/* Headers Tab */}
            {activeTab === 'headers' && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10 space-y-3">
                    {headers.map((header, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <input type="checkbox" checked={header.enabled}
                                onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                                className="w-4 h-4 rounded accent-primary" />
                            <input type="text" value={header.key}
                                onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                placeholder="Header name"
                                className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-main dark:text-white" />
                            <input type="text" value={header.value}
                                onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                placeholder="Value"
                                className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-text-main dark:text-white" />
                            <button onClick={() => removeHeader(index)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button onClick={addHeader}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                        <Plus className="w-4 h-4" /> Add Header
                    </button>
                </div>
            )}

            {/* Body Tab */}
            {activeTab === 'body' && (
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                    <textarea value={requestBody} onChange={(e) => setRequestBody(e.target.value)}
                        placeholder='{"key": "value"}'
                        rows={8}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm resize-none" />
                    <p className="text-xs text-gray-400 mt-2">Only used for POST, PUT, and PATCH requests</p>
                </div>
            )}

            {/* Response Tab */}
            {activeTab === 'response' && (
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    {result ? (
                        <>
                            {/* Response Header */}
                            <div className={`px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between ${result.success ? 'bg-green-50 dark:bg-green-900/10' : 'bg-red-50 dark:bg-red-900/10'}`}>
                                <div className="flex items-center gap-3">
                                    {result.success ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
                                    <span className={`font-bold text-lg ${getStatusColor(result.status)}`}>
                                        {result.status || 'Error'} {result.statusText}
                                    </span>
                                    <span className="text-sm text-gray-500">{result.responseTime}ms</span>
                                </div>
                                {result.body && (
                                    <button onClick={copyResponse}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-white/10 rounded-lg text-sm font-bold">
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copied!' : 'Copy'}
                                    </button>
                                )}
                            </div>

                            {/* Response Body */}
                            <div className="p-6">
                                {result.error ? (
                                    <p className="text-red-600 dark:text-red-400 font-mono text-sm">{result.error}</p>
                                ) : (
                                    <pre className="text-sm font-mono text-text-main dark:text-gray-300 whitespace-pre-wrap overflow-x-auto max-h-[400px] overflow-y-auto">
                                        {result.body || '[Empty response]'}
                                    </pre>
                                )}
                            </div>

                            {/* Response Headers */}
                            {result.headers && Object.keys(result.headers).length > 0 && (
                                <div className="border-t border-gray-100 dark:border-white/10 px-6 py-4">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Response Headers</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        {Object.entries(result.headers).map(([key, value]) => (
                                            <div key={key} className="flex gap-2 font-mono">
                                                <span className="text-gray-500">{key}:</span>
                                                <span className="text-text-main dark:text-white truncate">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center text-gray-400">
                            <Play className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p>Send a request to see the response</p>
                        </div>
                    )}
                </div>
            )}

            {/* How It Works */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-3">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Makes real HTTP requests directly from your browser</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Works with APIs that have CORS enabled (public APIs)</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Add custom headers and request body for POST/PUT</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>100% browser-based — no proxy or server involved</li>
                </ul>
            </div>
        </div>
    );
};
