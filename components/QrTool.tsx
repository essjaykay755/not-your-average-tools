"use client";

import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling, {
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType,
  Options
} from 'qr-code-styling';
import { Wifi, Link as LinkIcon, Mail, FileText, UserSquare, Download, Upload, Image as ImageIcon, Settings, Palette } from 'lucide-react';

type QrType = 'url' | 'text' | 'wifi' | 'email' | 'vcard';

export const QrTool: React.FC = () => {
  // Core State
  const [activeTab, setActiveTab] = useState<QrType>('url');
  const [size, setSize] = useState(1024); // High res by default for download
  const [qrValue, setQrValue] = useState('');

  // Styling State
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logo, setLogo] = useState<string | null>(null);
  const [dotType, setDotType] = useState<DotType>('square');
  const [cornerSquareType, setCornerSquareType] = useState<CornerSquareType>('square');
  const [cornerDotType, setCornerDotType] = useState<CornerDotType>('square');

  // Data Inputs State
  const [url, setUrl] = useState('https://notyouraverage.tools');
  const [text, setText] = useState('Hello World');
  const [wifi, setWifi] = useState({ ssid: '', password: '', encryption: 'WPA' });
  const [email, setEmail] = useState({ to: '', subject: '', body: '' });
  const [vcard, setVcard] = useState({ firstName: '', lastName: '', phone: '', email: '', org: '', website: '' });

  // Refs
  const qrCode = useRef<QRCodeStyling | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Initialize QR Code Library
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      type: 'canvas', // precise rendering
      image: logo || undefined,
      dotsOptions: {
        color: fgColor,
        type: dotType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: fgColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: fgColor
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10
      }
    });

    if (ref.current) {
      qrCode.current.append(ref.current);
    }
  }, []);

  // Update Logic
  useEffect(() => {
    let val = '';
    switch (activeTab) {
      case 'url': val = url; break;
      case 'text': val = text; break;
      case 'wifi': val = `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};H:false;;`; break;
      case 'email': val = `mailto:${email.to}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`; break;
      case 'vcard': val = `BEGIN:VCARD\nVERSION:3.0\nN:${vcard.lastName};${vcard.firstName};;;\nFN:${vcard.firstName} ${vcard.lastName}\nORG:${vcard.org}\nTEL;TYPE=CELL:${vcard.phone}\nEMAIL:${vcard.email}\nURL:${vcard.website}\nEND:VCARD`; break;
    }
    setQrValue(val);

    qrCode.current?.update({
      data: val,
      width: size,
      height: size,
      image: logo || undefined,
      dotsOptions: {
        color: fgColor,
        type: dotType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        type: cornerSquareType,
        color: fgColor
      },
      cornersDotOptions: {
        type: cornerDotType,
        color: fgColor
      }
    });
  }, [activeTab, url, text, wifi, email, vcard, size, fgColor, bgColor, logo, dotType, cornerSquareType, cornerDotType]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const downloadQr = () => {
    qrCode.current?.download({
      name: `NYAT-qr-${activeTab}-${Date.now()}`,
      extension: 'png'
    });
  };

  const tabs = [
    { id: 'url', label: 'Link', icon: LinkIcon },
    { id: 'text', label: 'Text', icon: FileText },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'vcard', label: 'Contact', icon: UserSquare },
  ];

  const dottypes: DotType[] = ['square', 'dots', 'rounded', 'classy', 'classy-rounded', 'extra-rounded'];
  const cornerSquareTypes: CornerSquareType[] = ['square', 'dot', 'extra-rounded'];
  const cornerDotTypes: CornerDotType[] = ['square', 'dot'];

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full max-w-7xl mx-auto">
      {/* Left: Controls */}
      <div className="flex-1 flex flex-col gap-6">

        {/* Type Selection */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-2 shadow-sm border border-gray-100 dark:border-white/5 flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as QrType)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'text-text-sub dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Input Forms */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main dark:text-white">Website URL</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm" placeholder="https://example.com" />
            </div>
          )}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <label className="text-sm font-bold text-text-main dark:text-white">Plain Text</label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm min-h-[120px] resize-y" placeholder="Enter your text here..." />
            </div>
          )}
          {activeTab === 'wifi' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-text-main dark:text-white block mb-2">Network Name (SSID)</label>
                <input type="text" value={wifi.ssid} onChange={(e) => setWifi({ ...wifi, ssid: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-text-main dark:text-white block mb-2">Password</label>
                <input type="text" value={wifi.password} onChange={(e) => setWifi({ ...wifi, password: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div>
                <label className="text-sm font-bold text-text-main dark:text-white block mb-2">Encryption</label>
                <select value={wifi.encryption} onChange={(e) => setWifi({ ...wifi, encryption: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all text-text-main dark:text-white dark:[color-scheme:dark]">
                  <option value="WPA" className="bg-white dark:bg-[#171717] text-black dark:text-white">WPA/WPA2</option>
                  <option value="WEP" className="bg-white dark:bg-[#171717] text-black dark:text-white">WEP</option>
                  <option value="nopass" className="bg-white dark:bg-[#171717] text-black dark:text-white">None</option>
                </select>
              </div>
            </div>
          )}
          {activeTab === 'email' && (
            <div className="space-y-4">
              <input type="email" placeholder="Recipient (to)" value={email.to} onChange={e => setEmail({ ...email, to: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="text" placeholder="Subject" value={email.subject} onChange={e => setEmail({ ...email, subject: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <textarea placeholder="Body" value={email.body} onChange={e => setEmail({ ...email, body: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px]" />
            </div>
          )}
          {activeTab === 'vcard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="First Name" value={vcard.firstName} onChange={e => setVcard({ ...vcard, firstName: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="text" placeholder="Last Name" value={vcard.lastName} onChange={e => setVcard({ ...vcard, lastName: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="tel" placeholder="Phone" value={vcard.phone} onChange={e => setVcard({ ...vcard, phone: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="email" placeholder="Email" value={vcard.email} onChange={e => setVcard({ ...vcard, email: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50" />
              <input type="text" placeholder="Organization" value={vcard.org} onChange={e => setVcard({ ...vcard, org: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 col-span-2" />
              <input type="url" placeholder="Website" value={vcard.website} onChange={e => setVcard({ ...vcard, website: e.target.value })} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-4 outline-none focus:ring-2 focus:ring-primary/50 col-span-2" />
            </div>
          )}
        </div>

        {/* Customization Options */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-white/5 space-y-6">
          <h3 className="text-lg font-bold text-text-main dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Customization
          </h3>

          {/* Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Foreground</label>
              <div className="flex gap-2">
                <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)} className="size-10 rounded-lg cursor-pointer bg-transparent" />
                <input type="text" value={fgColor} onChange={e => setFgColor(e.target.value)} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 outline-none font-mono uppercase text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Background</label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="size-10 rounded-lg cursor-pointer bg-transparent" />
                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 outline-none font-mono uppercase text-sm" />
              </div>
            </div>
          </div>

          {/* Shapes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Dot Pattern</label>
              <select value={dotType} onChange={e => setDotType(e.target.value as DotType)} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-sm text-text-main dark:text-white dark:[color-scheme:dark]">
                {dottypes.map(t => <option key={t} value={t} className="bg-white dark:bg-[#171717] text-black dark:text-white">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Corner Square</label>
              <select value={cornerSquareType} onChange={e => setCornerSquareType(e.target.value as CornerSquareType)} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-sm text-text-main dark:text-white dark:[color-scheme:dark]">
                {cornerSquareTypes.map(t => <option key={t} value={t} className="bg-white dark:bg-[#171717] text-black dark:text-white">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Corner Dot</label>
              <select value={cornerDotType} onChange={e => setCornerDotType(e.target.value as CornerDotType)} className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 outline-none text-sm text-text-main dark:text-white dark:[color-scheme:dark]">
                {cornerDotTypes.map(t => <option key={t} value={t} className="bg-white dark:bg-[#171717] text-black dark:text-white">{t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}</option>)}
              </select>
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Add Logo (optional)</label>
            <div className="relative group">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl group-hover:border-primary/50 transition-colors bg-gray-50 dark:bg-black/20">
                {logo ? (
                  <div className="size-12 rounded-lg overflow-hidden bg-white relative">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                    <button onClick={(e) => { e.preventDefault(); setLogo(null); }} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"><div className="w-2 h-2" /></button>
                  </div>
                ) : (
                  <div className="size-12 rounded-lg bg-gray-200 dark:bg-white/5 flex items-center justify-center text-gray-400">
                    <Upload className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm font-bold text-text-main dark:text-white">Click to upload logo</p>
                  <p className="text-xs text-text-sub dark:text-gray-400">PNG, JPG, SVG supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Preview & Download */}
      <div className="xl:w-[400px] flex flex-col gap-6">
        <div className="sticky top-8 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 flex flex-col items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-500"></div>

            <h2 className="text-xl font-black text-gray-800 tracking-tight">Preview</h2>

            <div className="relative p-6 bg-white rounded-xl shadow-inner border border-gray-100 flex items-center justify-center w-full aspect-square" style={{ backgroundColor: bgColor }}>
              <div ref={ref} className="[&>canvas]:w-full [&>canvas]:h-auto [&>canvas]:max-w-full" />
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={downloadQr}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group"
              >
                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                Download PNG
              </button>
              <p className="text-xs text-center text-gray-400">High Resolution • {size}x{size}px</p>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <label className="text-sm font-bold text-text-sub dark:text-gray-400 block mb-2">Resolution</label>
            <input
              type="range"
              min="512"
              max="4096"
              step="128"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
              <span>512px</span>
              <span>{size}px</span>
              <span>4k</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
