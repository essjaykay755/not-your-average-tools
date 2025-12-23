"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

export const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage or preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      if (systemDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="h-24 w-full" />;
  }

  return (
    <header className="w-full relative z-50 pt-8 px-6 md:px-8 mb-4 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2 select-none">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 text-2xl md:text-3xl font-black tracking-tighter text-text-main dark:text-white group-hover:scale-105 transition-transform duration-300 block">
              NotYourAverage<span className="text-primary">.Tools</span>
            </span>
          </div>
        </Link>

        {/* Right Section: Nav + Actions */}
        <div className="flex items-center gap-8">
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-sm font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm font-bold uppercase tracking-widest text-text-sub dark:text-gray-400 hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Separator */}
          <div className="hidden md:block w-px h-6 bg-gray-200 dark:bg-white/10"></div>

          {/* Icons & Theme */}
          <div className="flex items-center gap-4">

            <a href="https://x.com/essjaykay755" target="_blank" rel="noopener noreferrer" className="text-text-sub dark:text-gray-400 hover:text-primary transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <button
              onClick={toggleTheme}
              className="relative group p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle Theme"
            >
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-white/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              {isDark ? (
                <Sun className="w-5 h-5 text-gray-200 group-hover:text-yellow-400 transition-colors relative z-10" />
              ) : (
                <Moon className="w-5 h-5 text-text-main group-hover:text-primary transition-colors relative z-10" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};