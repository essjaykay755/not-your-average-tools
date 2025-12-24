"use client";

import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';
import Image from 'next/image';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-white dark:bg-surface-dark pt-20 pb-10 px-4 mt-auto overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Top: Mega Title */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter text-gray-100 dark:text-white/5 select-none pointer-events-none">
            EXTRAORDINARY
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-12">

          {/* Module 1: Brand & Identity (Span 5) */}
          <div className="md:col-span-5 bg-gray-50 dark:bg-white/5 rounded-3xl p-8 flex flex-col justify-between border border-gray-100 dark:border-white/10 group hover:border-primary/50 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10 md:w-12 md:h-12">
                   <Image 
                      src="/logo.png" 
                      alt="Logo" 
                      fill
                      className="object-contain"
                   />
                </div>
                <h3 className="text-2xl font-black tracking-tighter text-text-main dark:text-white">NotYourAverage<span className="text-primary">.Tools</span></h3>
              </div>
              <p className="text-text-sub dark:text-gray-400 leading-relaxed">
                The elite digital arsenal. <strong className="text-text-main dark:text-white">Fully Private</strong>, <strong className="text-text-main dark:text-white">On-Device</strong>, and <strong className="text-text-main dark:text-white">100% Free</strong>. Built for performance, designed for precision.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <a href="https://x.com/essjaykay755" target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white dark:bg-black flex items-center justify-center text-text-main dark:text-white hover:bg-primary hover:text-white transition-all">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Module 2: Navigation Tiles (Span 3) */}
          <div className="md:col-span-3 grid grid-rows-2 gap-4">
            <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 hover:border-primary/50 transition-colors flex flex-col justify-center">
              <span className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Legal Pages</span>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-text-main dark:text-white font-medium hover:text-primary flex items-center gap-2"><span className="size-1 bg-transparent dark:bg-white/20 rounded-full group-hover:bg-primary"></span>Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-text-main dark:text-white font-medium hover:text-primary flex items-center gap-2"><span className="size-1 bg-transparent dark:bg-white/20 rounded-full group-hover:bg-primary"></span>Terms of Service</Link></li>
              </ul>
            </div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 hover:border-primary/50 transition-colors flex flex-col justify-center">
              <span className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-wider">Links</span>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-text-main dark:text-white font-medium hover:text-primary">About</Link></li>
                <li><Link href="/contact" className="text-text-main dark:text-white font-medium hover:text-primary">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Module 3: Arsenal Stats (Span 4) */}
          <div className="md:col-span-4 bg-[#121212] text-white rounded-3xl p-8 flex flex-col justify-between border border-gray-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors"></div>

            <div>
              <div className="flex items-center gap-2 mb-6 opacity-50 font-mono text-xs">
                <span className="size-2 rounded-full bg-green-500"></span>
                <span className="ml-2">system_status.log</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Arsenal Capacity</h4>
              <p className="text-gray-400 text-sm">Continuously expanding suite of high-performance developer tools.</p>
            </div>

            <div className="mt-8">
              <div className="text-6xl font-black tracking-tighter text-white mb-1">
                {ALL_TOOLS.length}
              </div>
              <div className="text-sm font-medium text-gray-400 uppercase tracking-widest">Total Tools Active</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-100 dark:border-white/5 gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">All Systems Operational</span>
          </div>

          <p className="text-xs text-text-sub dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} NotYourAverage.Tools
          </p>
        </div>

      </div>
    </footer>
  );
};

