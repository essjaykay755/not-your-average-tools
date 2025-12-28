import { ToolGrid } from '@/components/ToolGrid';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-12">
      {/* Hero Section - Static, renders on server */}
      <section className="relative w-full flex flex-col items-center text-center">
        <div className="max-w-[800px] w-full flex flex-col items-center gap-8">
          <div className="flex flex-col gap-3">
            <h1 className="text-text-main dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em]">
              Better tools for <br className="hidden md:block" /> <span className="text-primary">extraordinary creators</span>
            </h1>
            <p className="text-text-sub dark:text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
              A curated arsenal of high-performance utilities. <span className="font-semibold text-text-main dark:text-white">Fully Private</span>, <span className="font-semibold text-text-main dark:text-white">On-Device</span>, and <span className="font-semibold text-text-main dark:text-white">100% Free</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Tool Grid - Client component for interactivity */}
      <ToolGrid />
    </div>
  );
}
