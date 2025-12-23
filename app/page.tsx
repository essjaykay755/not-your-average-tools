"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Tool } from '../types';
import { SearchX } from 'lucide-react';
import { ALL_TOOLS } from '@/data/tools';

const CATEGORIES = ['Creator', 'Developer', 'Design', 'Utility'];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col gap-12 py-12">
      {/* Hero Section */}
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

          <div className="flex items-center w-full max-w-md bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-2xl p-2 shadow-sm transition-all focus-within:shadow-md focus-within:ring-2 focus-within:ring-primary/20">
            <input
              id="tool-search-input"
              type="text"
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-4 text-text-main dark:text-white placeholder:text-gray-400 font-medium h-10"
            />
            <button className="size-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-text-sub dark:text-gray-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="flex justify-center pb-4">
        <div className="bg-white/80 dark:bg-black/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-1.5 rounded-full shadow-sm overflow-x-auto max-w-full">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm whitespace-nowrap ${activeCategory === 'All'
                ? 'bg-primary text-white shadow-md hover:scale-105'
                : 'bg-white border border-gray-200 hover:border-primary/50 text-text-main hover:text-primary dark:bg-surface-dark dark:border-white/10 dark:text-gray-300 dark:hover:text-white'
                }`}
            >
              All Arsenal
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all hover:shadow-sm whitespace-nowrap ${activeCategory === cat
                  ? 'bg-primary text-white shadow-md hover:scale-105'
                  : 'bg-white border border-gray-200 hover:border-primary/50 text-text-main hover:text-primary dark:bg-surface-dark dark:border-white/10 dark:text-gray-300 dark:hover:text-white'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section id="popular">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <Link
                href={tool.path}
                key={tool.id}
                className="group relative flex flex-col h-full rounded-3xl bg-white dark:bg-white/5 backdrop-blur-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 p-6 overflow-hidden ring-1 ring-black/5 dark:ring-white/5"
              >
                {/* Hover Gradient Blob */}
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-colors pointer-events-none opacity-0 group-hover:opacity-100 duration-500"></div>

                {/* Background Icon Watermark */}
                <div className="absolute -top-6 -left-6 z-0 pointer-events-none transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <tool.icon
                    strokeWidth={1.5}
                    className="w-[140px] h-[140px] -rotate-12 text-gray-100 dark:text-white/5"
                  />
                </div>

                <div className="relative z-10 flex flex-col h-full pt-2">
                  <div className="flex items-start justify-end mb-4">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/5 text-text-sub dark:text-gray-400 backdrop-blur-sm">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="h-16 flex items-end font-black text-2xl text-text-main dark:text-white mb-2 tracking-tight group-hover:text-primary transition-colors line-clamp-2">
                    {tool.name}
                  </h3>

                  <p className="text-text-sub dark:text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 h-[72px]">
                    {tool.description}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform">
                    <span>Launch</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </div>
                </div>


              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4">
              <SearchX className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">Not found in our arsenal</h3>
            <p className="text-text-sub dark:text-gray-400 max-w-md">
              We couldn't find matches for "{searchQuery}". We're constantly expanding our collection.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
