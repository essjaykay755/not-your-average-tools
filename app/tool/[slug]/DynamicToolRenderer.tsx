"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Loading skeleton for tools
const ToolSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-white/10 rounded-lg w-1/3"></div>
        <div className="h-64 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
        <div className="h-32 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
    </div>
);

// Dynamic imports for all tools - only loads the JS when the specific tool is accessed
export const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
    'markdown': dynamic(() => import('@/components/MarkdownTool').then(m => ({ default: m.MarkdownTool })), { loading: () => <ToolSkeleton /> }),
    'json': dynamic(() => import('@/components/JsonTool').then(m => ({ default: m.JsonTool })), { loading: () => <ToolSkeleton /> }),
    'qr': dynamic(() => import('@/components/QrTool').then(m => ({ default: m.QrTool })), { loading: () => <ToolSkeleton /> }),
    'base64': dynamic(() => import('@/components/Base64Tool').then(m => ({ default: m.Base64Tool })), { loading: () => <ToolSkeleton /> }),
    'regex': dynamic(() => import('@/components/RegexTool').then(m => ({ default: m.RegexTool })), { loading: () => <ToolSkeleton /> }),
    'color': dynamic(() => import('@/components/ColorTool').then(m => ({ default: m.ColorTool })), { loading: () => <ToolSkeleton /> }),
    'lorem': dynamic(() => import('@/components/LoremTool').then(m => ({ default: m.LoremTool })), { loading: () => <ToolSkeleton /> }),
    'diff': dynamic(() => import('@/components/DiffTool').then(m => ({ default: m.DiffTool })), { loading: () => <ToolSkeleton /> }),
    'watermark': dynamic(() => import('@/components/WatermarkTool').then(m => ({ default: m.WatermarkTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'python': dynamic(() => import('@/components/PythonTool').then(m => ({ default: m.PythonTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'emoji': dynamic(() => import('@/components/EmojiTool').then(m => ({ default: m.EmojiTool })), { loading: () => <ToolSkeleton /> }),
    'image': dynamic(() => import('@/components/ImageTool').then(m => ({ default: m.ImageTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'password': dynamic(() => import('@/components/PasswordTool').then(m => ({ default: m.PasswordTool })), { loading: () => <ToolSkeleton /> }),
    'sql': dynamic(() => import('@/components/SqlTool').then(m => ({ default: m.SqlTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'glass': dynamic(() => import('@/components/GlassTool').then(m => ({ default: m.GlassTool })), { loading: () => <ToolSkeleton /> }),
    'terminal': dynamic(() => import('@/components/TerminalTool').then(m => ({ default: m.TerminalTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'mesh': dynamic(() => import('@/components/MeshTool').then(m => ({ default: m.MeshTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'cron': dynamic(() => import('@/components/CronTool').then(m => ({ default: m.CronTool })), { loading: () => <ToolSkeleton /> }),
    'totp': dynamic(() => import('@/components/TotpTool').then(m => ({ default: m.TotpTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'portrait': dynamic(() => import('@/components/PortraitTool').then(m => ({ default: m.PortraitTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'jwt': dynamic(() => import('@/components/JwtTool').then(m => ({ default: m.JwtTool })), { loading: () => <ToolSkeleton /> }),
    'social-resize': dynamic(() => import('@/components/SocialResizeTool').then(m => ({ default: m.SocialResizeTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'px-rem': dynamic(() => import('@/components/PxRemTool').then(m => ({ default: m.PxRemTool })), { loading: () => <ToolSkeleton /> }),
    'key-events': dynamic(() => import('@/components/KeyEventsTool').then(m => ({ default: m.KeyEventsTool })), { loading: () => <ToolSkeleton /> }),
    'ico-converter': dynamic(() => import('@/components/IcoConverterTool').then(m => ({ default: m.IcoConverterTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'app-icon-generator': dynamic(() => import('@/components/AppIconGeneratorTool').then(m => ({ default: m.AppIconGeneratorTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'timestamp': dynamic(() => import('@/components/TimestampTool').then(m => ({ default: m.TimestampTool })), { loading: () => <ToolSkeleton /> }),
    'hash': dynamic(() => import('@/components/HashGeneratorTool').then(m => ({ default: m.HashGeneratorTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'og-preview': dynamic(() => import('@/components/OpenGraphTool').then(m => ({ default: m.OpenGraphTool })), { loading: () => <ToolSkeleton /> }),
    'meta-tags': dynamic(() => import('@/components/MetaTagTool').then(m => ({ default: m.MetaTagTool })), { loading: () => <ToolSkeleton /> }),
    'cors': dynamic(() => import('@/components/CorsTool').then(m => ({ default: m.CorsTool })), { loading: () => <ToolSkeleton /> }),
    'webhook': dynamic(() => import('@/components/WebhookTool').then(m => ({ default: m.WebhookTool })), { loading: () => <ToolSkeleton /> }),
    'ascii-art': dynamic(() => import('@/components/AsciiArtTool').then(m => ({ default: m.AsciiArtTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'regex-explainer': dynamic(() => import('@/components/RegexExplainerTool').then(m => ({ default: m.RegexExplainerTool })), { loading: () => <ToolSkeleton /> }),
    'fake-data': dynamic(() => import('@/components/FakeDataTool').then(m => ({ default: m.FakeDataTool })), { loading: () => <ToolSkeleton /> }),
    'color-palette': dynamic(() => import('@/components/ColorPaletteTool').then(m => ({ default: m.ColorPaletteTool })), { loading: () => <ToolSkeleton />, ssr: false }),
    'code-snippet': dynamic(() => import('@/components/CodeSnippetGeneratorTool').then(m => ({ default: m.CodeSnippetGeneratorTool })), { loading: () => <ToolSkeleton />, ssr: false }),
};

interface DynamicToolRendererProps {
    slug: string;
}

export function DynamicToolRenderer({ slug }: DynamicToolRendererProps) {
    const ToolComponent = TOOL_COMPONENTS[slug];

    if (!ToolComponent) {
        return null;
    }

    return <ToolComponent />;
}
