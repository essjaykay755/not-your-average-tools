"use client";

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  Code, Quote, Link as LinkIcon, Image as ImageIcon,
  List, ListOrdered, Minus,
  Download, Printer, FileType, FileJson, FileText, FileCode
} from 'lucide-react';

const defaultMarkdown = `# Welcome to NotYourAverage.Tools Editor

Type on the left, see the result on the right. 

## Features
- **Live Preview**: See changes instantly.
- **Shortcuts**: Use \`Ctrl+B\` for bold, \`Ctrl+I\` for italic.
- **Export**: Download as MD, HTML, TXT, or PDF.

> "Simplicity is the ultimate sophistication." – Leonardo da Vinci

\`\`\`javascript
console.log("Hello, World!");
\`\`\`
`;

export const MarkdownTool: React.FC = () => {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Resizable Pane Logic
  const [isDragging, setIsDragging] = useState(false);
  const [editorPercentage, setEditorPercentage] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragPercentage = useRef(50);
  const containerRectRef = useRef<DOMRect | null>(null);
  const requestRef = useRef<number>(0);

  const startResizing = React.useCallback(() => {
    if (containerRef.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    }
    dragPercentage.current = editorPercentage;
    setIsDragging(true);
  }, [editorPercentage]);

  const stopResizing = React.useCallback(() => {
    setIsDragging(false);
    setEditorPercentage(dragPercentage.current);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isDragging && containerRef.current && containerRectRef.current) {
        // Capture clientX immediately to use in the RAF closure
        const clientX = mouseMoveEvent.clientX;

        // Throttle updates with requestAnimationFrame
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        requestRef.current = requestAnimationFrame(() => {
          const containerRect = containerRectRef.current!;
          const newEditorWidth = clientX - containerRect.left;
          let newPercentage = (newEditorWidth / containerRect.width) * 100;

          // Limit resize range (min 20%, max 80%)
          newPercentage = Math.max(20, Math.min(80, newPercentage));

          if (containerRef.current) {
            containerRef.current.style.setProperty('--editor-pct', `${newPercentage}%`);
            containerRef.current.style.setProperty('--preview-pct', `${100 - newPercentage}%`);
          }

          dragPercentage.current = newPercentage;
        });
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [resize, stopResizing, isDragging]);

  // Helper to insert text at cursor
  const insertText = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousText = textarea.value;
    const selectedText = previousText.substring(start, end);

    const newText = previousText.substring(0, start) + before + selectedText + after + previousText.substring(end);
    setMarkdown(newText);

    // Reset cursor / selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Toolbar Actions
  const actions = [
    { icon: Bold, label: "Bold (Ctrl+B)", action: () => insertText("**", "**") },
    { icon: Italic, label: "Italic (Ctrl+I)", action: () => insertText("*", "*") },
    { icon: Strikethrough, label: "Strikethrough", action: () => insertText("~~", "~~") },
    { separator: true },
    { icon: Heading1, label: "Heating 1", action: () => insertText("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertText("## ") },
    { icon: Heading3, label: "Heading 3", action: () => insertText("### ") },
    { separator: true },
    { icon: Code, label: "Code Block", action: () => insertText("```\n", "\n```") },
    { icon: Quote, label: "Quote", action: () => insertText("> ") },
    { separator: true },
    { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
    { icon: ImageIcon, label: "Image", action: () => insertText("![alt text](", ")") },
    { separator: true },
    { icon: List, label: "Unordered List", action: () => insertText("- ") },
    { icon: ListOrdered, label: "Ordered List", action: () => insertText("1. ") },
    { icon: Minus, label: "Horizontal Rule", action: () => insertText("\n---\n") },
  ];

  // Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b': e.preventDefault(); insertText("**", "**"); break;
          case 'i': e.preventDefault(); insertText("*", "*"); break;
        }
      }
    };
    // Attach to textarea only when focused ideally, but global for tool is usually fine or attach to ref
    const textarea = textareaRef.current;
    if (textarea) textarea.addEventListener('keydown', handleKeyDown);
    return () => {
      if (textarea) textarea.removeEventListener('keydown', handleKeyDown);
    }
  }, [markdown]); // deps for insertText closure if needed, though ref based logic might be safer from stale closures if logic was complex. inserting text depends on current value ref access is direct.

  // Export Functions
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Very simple print style
      const htmlContent = document.getElementById('markdown-preview')?.innerHTML || '';
      printWindow.document.write(`
                <html>
                <head>
                    <title>Print - NotYourAverage.Tools</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
                        h1, h2, h3 { color: #111; }
                        code { background: #f4f4f4; padding: 2px 5px; border-radius: 4px; font-family: monospace; }
                        pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
                        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 15px; color: #666; }
                        img { max-width: 100%; border-radius: 8px; }
                        table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background: #f8f8f8; }
                        a { color: #0066cc; text-decoration: none; }
                    </style>
                </head>
                <body>${htmlContent}</body>
                </html>
            `);
      printWindow.document.close();
      printWindow.print();
    }
  };


  return (
    <div
      className="flex flex-col gap-4 min-h-[calc(100vh-140px)] w-full max-w-none mx-auto py-4 md:py-4"
      style={{
        // @ts-ignore - CSS variables are valid in style
        '--editor-pct': `${editorPercentage}%`,
        '--preview-pct': `${100 - editorPercentage}%`
      }}
    >

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((item, idx) => (
            item.separator ? (
              <div key={idx} className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
            ) : (
              <button
                key={idx}
                onClick={item.action}
                title={item.label}
                className="p-2 text-text-sub dark:text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
              </button>
            )
          ))}
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-text-main dark:text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>

          {showExportMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-1">
                <button onClick={() => downloadFile(markdown, `NYAT-markdown-${Date.now()}.md`, 'text/markdown')} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-text-main dark:text-gray-300">
                  <FileCode className="w-4 h-4 text-blue-500" /> Markdown (.md)
                </button>
                <button onClick={() => downloadFile(document.getElementById('markdown-preview')?.innerHTML || '', `NYAT-markdown-${Date.now()}.html`, 'text/html')} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-text-main dark:text-gray-300">
                  <FileType className="w-4 h-4 text-orange-500" /> HTML (.html)
                </button>
                <button onClick={() => downloadFile(markdown, `NYAT-markdown-${Date.now()}.txt`, 'text/plain')} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-text-main dark:text-gray-300">
                  <FileText className="w-4 h-4 text-gray-500" /> Plain Text (.txt)
                </button>
                <div className="h-px bg-gray-100 dark:bg-white/10 my-1" />
                <button onClick={handlePrint} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-text-main dark:text-gray-300">
                  <Printer className="w-4 h-4 text-purple-500" /> Print / PDF
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setMarkdown('')}
            className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            Clear
          </button>
          {/* Overlay to close menu */}
          {showExportMenu && <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 flex flex-col lg:flex-row gap-6 lg:gap-0 lg:flex-nowrap lg:w-full relative"
      >
        {/* Editor */}
        <div
          className="flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm group focus-within:ring-2 ring-primary/20 transition-all min-h-[500px] min-w-0 overflow-hidden w-full lg:w-[calc(var(--editor-pct)_-_0.5rem)]"
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Editor</span>
          </div>
          <textarea
            ref={textareaRef}
            className="flex-1 w-full p-6 resize-none bg-transparent text-text-main dark:text-gray-200 focus:outline-none font-mono text-sm leading-relaxed overflow-hidden"
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            style={{ height: 'auto', minHeight: '100%' }}
            placeholder="# Start writing..."
          />
        </div>

        {/* Resizer Handle (Desktop Only) */}
        <div
          className="hidden lg:flex w-4 items-center justify-center cursor-col-resize hover:bg-primary/10 rounded-full transition-colors z-10 select-none shrink-0 self-stretch"
          onMouseDown={startResizing}
        >
          <div className="w-1 h-8 bg-gray-300 dark:bg-white/20 rounded-full active:bg-primary transition-colors" />
        </div>

        {/* Preview */}
        <div
          className="flex flex-col bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-white/10 shadow-sm min-h-[500px] min-w-0 overflow-hidden flex-1 w-full lg:w-[calc(var(--preview-pct)_-_0.5rem)]"
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Preview</span>
          </div>
          <div
            id="markdown-preview"
            className="flex-1 w-full h-full p-8"
          >
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
