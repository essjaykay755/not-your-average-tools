"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Webhook, Copy, Check, Trash2, RefreshCw } from "lucide-react";

interface WebhookRequest {
    id: string;
    timestamp: Date;
    method: string;
    headers: Record<string, string>;
    body: string;
    query: Record<string, string>;
}

export const WebhookTool: React.FC = () => {
    const [webhookId, setWebhookId] = useState<string>("");
    const [requests, setRequests] = useState<WebhookRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<WebhookRequest | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'headers' | 'body' | 'query'>('body');

    // Generate a unique webhook ID on mount
    useEffect(() => {
        const id = crypto.randomUUID().split('-')[0];
        setWebhookId(id);
    }, []);

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhook/${webhookId}`
        : `https://your-domain.com/api/webhook/${webhookId}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateNewId = () => {
        const id = crypto.randomUUID().split('-')[0];
        setWebhookId(id);
        setRequests([]);
        setSelectedRequest(null);
    };

    const clearRequests = () => {
        setRequests([]);
        setSelectedRequest(null);
    };

    // Simulate incoming webhook for demo purposes
    const simulateWebhook = useCallback(() => {
        const methods = ['POST', 'PUT', 'PATCH'];
        const newRequest: WebhookRequest = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            method: methods[Math.floor(Math.random() * methods.length)],
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'WebhookSender/1.0',
                'X-Request-Id': crypto.randomUUID(),
                'X-Signature': 'sha256=' + crypto.randomUUID().replace(/-/g, ''),
            },
            body: JSON.stringify({
                event: 'order.created',
                data: {
                    orderId: Math.floor(Math.random() * 100000),
                    amount: (Math.random() * 1000).toFixed(2),
                    currency: 'USD',
                    customer: { email: 'customer@example.com', name: 'John Doe' }
                },
                timestamp: new Date().toISOString()
            }, null, 2),
            query: { source: 'demo', version: 'v1' }
        };
        setRequests(prev => [newRequest, ...prev].slice(0, 50));
        setSelectedRequest(newRequest);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="space-y-6">
            {/* Webhook URL */}
            <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Webhook className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-text-main dark:text-white">Your Webhook URL</h3>
                        <p className="text-sm text-gray-500">Send requests to this URL to inspect them</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-text-main dark:text-white truncate">
                        {webhookUrl}
                    </div>
                    <button onClick={copyUrl} className="px-4 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center gap-2">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="flex gap-2 mt-4">
                    <button onClick={generateNewId} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-white/10 text-text-main dark:text-white rounded-xl text-sm font-bold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                        <RefreshCw className="w-4 h-4" /> New URL
                    </button>
                    <button onClick={simulateWebhook} className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                        🧪 Simulate Request
                    </button>
                    {requests.length > 0 && (
                        <button onClick={clearRequests} className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl text-sm font-bold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                            <Trash2 className="w-4 h-4" /> Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Split View: Request List + Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Request List */}
                <div className="lg:col-span-1 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                        <h3 className="font-bold text-text-main dark:text-white">Requests ({requests.length})</h3>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {requests.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Webhook className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">No requests yet</p>
                                <p className="text-xs mt-1">Send a request to your webhook URL or simulate one</p>
                            </div>
                        ) : (
                            requests.map((req) => (
                                <button key={req.id} onClick={() => setSelectedRequest(req)}
                                    className={`w-full px-4 py-3 text-left border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${selectedRequest?.id === req.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded ${req.method === 'POST' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : req.method === 'PUT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                            {req.method}
                                        </span>
                                        <span className="text-xs text-gray-400">{formatTime(req.timestamp)}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Request Details */}
                <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    {selectedRequest ? (
                        <>
                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-primary/10 text-primary">{selectedRequest.method}</span>
                                    <span className="text-sm text-gray-500">{selectedRequest.timestamp.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 p-2 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                                {(['body', 'headers', 'query'] as const).map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${activeTab === tab ? 'bg-white dark:bg-white/10 text-primary shadow-sm' : 'text-gray-500'}`}>
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 max-h-[300px] overflow-auto">
                                <pre className="text-sm font-mono text-text-main dark:text-gray-300 whitespace-pre-wrap">
                                    {activeTab === 'body' && selectedRequest.body}
                                    {activeTab === 'headers' && JSON.stringify(selectedRequest.headers, null, 2)}
                                    {activeTab === 'query' && JSON.stringify(selectedRequest.query, null, 2)}
                                </pre>
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            <p className="text-sm">Select a request to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="bg-[#1e1e1e] rounded-2xl p-6">
                <h3 className="text-white font-bold mb-3">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Get a unique webhook URL instantly</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Use "Simulate Request" to see how it works with demo data</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>View request headers, body, and query parameters</li>
                    <li className="flex items-start gap-2"><span className="text-primary">•</span>Note: Real webhook receiving requires a backend API route</li>
                </ul>
            </div>
        </div>
    );
};
