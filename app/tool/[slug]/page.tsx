import Link from 'next/link';
import { SearchX } from 'lucide-react';
import { ALL_TOOLS, getToolBySlug } from '@/data/tools';
import { Metadata } from 'next';
import { ToolPageClient } from './ToolPageClient';
import { DynamicToolRenderer } from './DynamicToolRenderer';

// Force dynamic rendering - tools contain client-only code that can't be prerendered
export const dynamic = 'force-dynamic';

// Generate static params for all tools - enables static generation
export function generateStaticParams() {
    return ALL_TOOLS.map(tool => ({ slug: tool.id }));
}

// Generate metadata for each tool page - improves SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const tool = getToolBySlug(slug);

    if (!tool) {
        return {
            title: 'Tool Not Found | NotYourAverage.Tools',
            description: 'The requested tool was not found.',
        };
    }

    return {
        title: `${tool.name} | NotYourAverage.Tools`,
        description: tool.description,
        openGraph: {
            title: `${tool.name} | NotYourAverage.Tools`,
            description: tool.description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${tool.name} | NotYourAverage.Tools`,
            description: tool.description,
        },
    };
}

interface ToolPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug } = await params;
    const tool = getToolBySlug(slug);

    if (!tool) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
                <div className="size-24 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center mb-6 ring-1 ring-red-100 dark:ring-red-500/20">
                    <SearchX className="w-10 h-10 text-red-500/50" />
                </div>
                <h1 className="text-3xl font-black text-text-main dark:text-white mb-4">Tool Not Found</h1>
                <p className="text-text-sub dark:text-gray-400 text-lg mb-8 max-w-md">The tool you are looking for does not exist in our arsenal.</p>
                <Link
                    href="/"
                    className="px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    Return to Arsenal
                </Link>
            </div>
        );
    }

    return (
        <ToolPageClient
            slug={slug}
            name={tool.name}
            description={tool.description}
            category={tool.category}
            usage={tool.usage}
        >
            <DynamicToolRenderer slug={slug} />
        </ToolPageClient>
    );
}
