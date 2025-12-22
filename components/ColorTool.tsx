"use client";

import React, { useState } from 'react';

export const ColorTool: React.FC = () => {
  const [color, setColor] = useState('#ea2a33');
  const [rgb, setRgb] = useState('rgb(234, 42, 51)');
  const [hsl, setHsl] = useState('hsl(357, 81%, 54%)');
  const [cmyk, setCmyk] = useState('cmyk(0%, 82%, 78%, 8%)');
  const [copied, setCopied] = useState<string | null>(null);

  // --- Helpers ---

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 0, m = 0, y = 0, k = 0;
    r = r / 255; g = g / 255; b = b / 255;
    k = Math.min(1 - r, 1 - g, 1 - b);
    if (k < 1) {
      c = (1 - r - k) / (1 - k);
      m = (1 - g - k) / (1 - k);
      y = (1 - b - k) / (1 - k);
    }
    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  }

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrast = (lum1: number, lum2: number) => {
    const bright = Math.max(lum1, lum2);
    const dark = Math.min(lum1, lum2);
    return (bright + 0.05) / (dark + 0.05);
  };

  const updateColor = (hex: string) => {
    setColor(hex);
    const rgbVal = hexToRgb(hex);
    if (rgbVal) {
      setRgb(`rgb(${rgbVal.r}, ${rgbVal.g}, ${rgbVal.b})`);
      const hslVal = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      setHsl(`hsl(${hslVal.h}, ${hslVal.s}%, ${hslVal.l}%)`);
      const cmykVal = rgbToCmyk(rgbVal.r, rgbVal.g, rgbVal.b);
      setCmyk(`cmyk(${cmykVal.c}%, ${cmykVal.m}%, ${cmykVal.y}%, ${cmykVal.k}%)`);
    }
  }

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColor(e.target.value);
  };

  const handleNativePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateColor(e.target.value);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  // --- Calculations for Preview & Accessibility ---

  const rgbVal = hexToRgb(color) || { r: 0, g: 0, b: 0 };
  const lumColor = getLuminance(rgbVal.r, rgbVal.g, rgbVal.b);
  const lumWhite = 1; // Luminance of #ffffff
  const lumDark = getLuminance(23, 23, 23); // Luminance of #171717 (surface-dark)

  const contrastLight = getContrast(lumColor, lumWhite);
  const contrastDark = getContrast(lumColor, lumDark);

  // Determine ideal text color on top of the selected color background
  const textOnColor = lumColor > 0.5 ? '#000000' : '#ffffff';

  const getScoreBadge = (ratio: number) => {
    if (ratio >= 7) return <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-green-600">AAA</span>;
    if (ratio >= 4.5) return <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-green-500">AA</span>;
    if (ratio >= 3) return <span className="text-[10px] font-bold text-black px-2 py-0.5 rounded-full bg-yellow-400">AA Large</span>;
    return <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-red-500">Fail</span>;
  };

  return (
    <div className="w-full max-w-none mx-auto p-4 md:p-8">
      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">

        {/* Left: Light Mode Preview */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-white text-gray-900 flex flex-col h-full min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">light_mode</span>
              <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Light Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-gray-700 text-sm">{contrastLight.toFixed(2)} : 1</span>
              {getScoreBadge(contrastLight)}
            </div>
          </div>
          <div className="p-8 flex flex-col gap-8 flex-1">
            <div>
              <h3 className="text-3xl font-bold mb-2 transition-colors break-words" style={{ color: color }}>Heading</h3>
              <p className="text-gray-600 leading-relaxed text-base">
                Body text on light. <span style={{ color: color, fontWeight: 'bold' }}>Emphasis</span> example.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-auto">
              <button style={{ backgroundColor: color, color: textOnColor }} className="px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-transform active:scale-95">
                Button
              </button>
              <button style={{ borderColor: color, color: color }} className="px-6 py-2.5 rounded-lg font-bold text-sm border-2 bg-transparent transition-transform active:scale-95 hover:bg-gray-50">
                Outline
              </button>
            </div>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col gap-8 order-first xl:order-none items-center justify-center">
          <div className="bg-white dark:bg-surface-dark p-8 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl flex flex-col gap-8 w-full max-w-sm">

            {/* Circular Color Picker */}
            <div className="flex justify-center py-4">
              <div className="relative size-56 rounded-full shadow-inner ring-4 ring-white dark:ring-white/5 ring-offset-4 ring-offset-gray-100 dark:ring-offset-[#171717] overflow-hidden group transition-transform hover:scale-105 active:scale-95">
                <input
                  type="color"
                  value={color.length >= 4 ? (color.startsWith('#') ? color : `#${color}`) : '#000000'}
                  onChange={handleNativePickerChange}
                  className="absolute inset-0 w-full h-full p-0 m-0 border-0 cursor-pointer opacity-0"
                />
                <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]" style={{ backgroundColor: color }} />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Hex Input (Editable) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Hex Code</label>
                <input
                  type="text"
                  value={color}
                  onChange={handleHexChange}
                  className="w-full p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-center text-text-main dark:text-white font-mono font-bold text-lg border border-gray-200 dark:border-white/10 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 uppercase transition-all"
                />
              </div>

              {/* RGB Input (Click to Copy) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex justify-between">
                  <span>RGB</span>
                  {copied === 'rgb' && <span className="text-primary animate-pulse">Copied!</span>}
                </label>
                <button
                  onClick={() => copyToClipboard(rgb, 'rgb')}
                  className="w-full p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-left text-text-main dark:text-gray-300 font-mono text-sm border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer truncate"
                >
                  {rgb}
                </button>
              </div>

              {/* CMYK Input (Click to Copy) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex justify-between">
                  <span>CMYK</span>
                  {copied === 'cmyk' && <span className="text-primary animate-pulse">Copied!</span>}
                </label>
                <button
                  onClick={() => copyToClipboard(cmyk, 'cmyk')}
                  className="w-full p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-left text-text-main dark:text-gray-300 font-mono text-sm border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer truncate"
                >
                  {cmyk}
                </button>
              </div>

              {/* HSL Input (Click to Copy) */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex justify-between">
                  <span>HSL</span>
                  {copied === 'hsl' && <span className="text-primary animate-pulse">Copied!</span>}
                </label>
                <button
                  onClick={() => copyToClipboard(hsl, 'hsl')}
                  className="w-full p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-left text-text-main dark:text-gray-300 font-mono text-sm border border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer truncate"
                >
                  {hsl}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Dark Mode Preview */}
        <div className="rounded-xl border border-white/10 overflow-hidden shadow-sm bg-[#171717] text-white flex flex-col h-full min-h-[400px]">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">dark_mode</span>
              <span className="font-bold text-xs uppercase tracking-wider text-gray-400">Dark Mode</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-gray-300 text-sm">{contrastDark.toFixed(2)} : 1</span>
              {getScoreBadge(contrastDark)}
            </div>
          </div>
          <div className="p-8 flex flex-col gap-8 flex-1">
            <div>
              <h3 className="text-3xl font-bold mb-2 transition-colors break-words" style={{ color: color }}>Heading</h3>
              <p className="text-gray-400 leading-relaxed text-base">
                Body text on dark. <span style={{ color: color, fontWeight: 'bold' }}>Emphasis</span> example.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 mt-auto">
              <button style={{ backgroundColor: color, color: textOnColor }} className="px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-transform active:scale-95">
                Button
              </button>
              <button style={{ borderColor: color, color: color }} className="px-6 py-2.5 rounded-lg font-bold text-sm border-2 bg-transparent transition-transform active:scale-95 hover:bg-white/5">
                Outline
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
