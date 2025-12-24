
import {
    FileText,
    Braces,
    QrCode,
    Palette,
    Type,
    Code,
    Regex,
    FileDiff,
    Image,
    Terminal,
    Smile,
    Image as ImageIcon,
    Lock,
    Database,
    BoxSelect,
    TerminalSquare,
    Blend,
    Clock,
    KeyRound,
    Camera,
} from 'lucide-react';
import { Tool } from '../types';

export const ALL_TOOLS: Tool[] = [
    {
        id: 'portrait',
        name: 'Portrait Mode',
        description: 'Add professional background blur to your photos using AI-powered person segmentation. Like camera portrait mode!',
        icon: Camera,
        path: '/tool/portrait',
        category: 'Creator',
        usage: 'Upload a portrait photo. AI will detect the person and blur the background. Adjust blur intensity and download.'
    },
    {
        id: 'mesh',
        name: 'Mesh Gradient',
        description: 'Create stunning organic mesh gradients with multiple color points. Export as CSS or SVG.',
        icon: Blend,
        path: '/tool/mesh',
        category: 'Designer',
        usage: 'Add color points and drag them around. Use presets for quick palettes. Adjust blur for softness. Copy CSS or download SVG.'
    },
    {
        id: 'cron',
        name: 'Crontab Guru',
        description: 'Build and understand cron expressions with plain English explanations and next run previews.',
        icon: Clock,
        path: '/tool/cron',
        category: 'Developer',
        usage: 'Type or build your cron expression. See when it will run next and get a human-readable description. Use presets for common schedules.'
    },
    {
        id: 'totp',
        name: 'TOTP Authenticator',
        description: 'Generate 2FA codes locally. Your secrets never leave your browser. Privacy-focused alternative to auth apps.',
        icon: KeyRound,
        path: '/tool/totp',
        category: 'Security',
        usage: 'Add your TOTP secret key (Base32) from any service. Codes refresh every 30 seconds. Click to copy. All data stays local.'
    },
    {
        id: 'terminal',
        name: 'Linux Terminal',
        description: 'Interactive Linux terminal emulator with a virtual file system. Practice commands safely.',
        icon: TerminalSquare,
        path: '/tool/terminal',
        category: 'Developer',
        usage: 'Type standard Linux commands like ls, cd, mkdir, cat. Try "help" to see all available commands. Includes neofetch!'
    },
    {
        id: 'glass',
        name: 'Glassmorphism Gen',
        description: 'Design beautiful frosted glass effects (Glassmorphism) for your UI. Adjust blur, transparency, and saturation live.',
        icon: BoxSelect,
        path: '/tool/glass',
        category: 'Designer',
        usage: 'Use the sliders to tweak the backdrop-filter properties. The preview card updates instantly. Click the Copy button to grab the CSS.'
    },
    {
        id: 'sql',
        name: 'SQL Playground',
        description: 'Run SQL queries on a private, in-memory SQLite database. Perfect for testing and learning.',
        icon: Database,
        path: '/tool/sql',
        category: 'Developer',
        usage: 'Write standard SQL queries in the editor. Tables "users" and "orders" are pre-loaded for you. Press Run to see results instantly.'
    },
    {
        id: 'password',
        name: 'Secure Pass',
        description: 'Generate strong, secure passwords instantly with custom rules. 100% client-side generation.',
        icon: Lock,
        path: '/tool/password',
        category: 'Utility',
        usage: 'Adjust the length slider and toggle character types (uppercase, numbers, etc.) to match your requirements. Click "Generate" to create a new password and click the result to copy it.'
    },
    {
        id: 'image',
        name: 'Image Optimizr',
        description: 'Compress and convert images locally. Supports WebP, JPEG, PNG resizing and optimization.',
        icon: ImageIcon,
        path: '/tool/image',
        category: 'Creator',
        usage: 'Drag and drop your image. Adjust the quality slider and max width. Select your output format (WebP is recommended for web). Click compress and download your smaller file.'
    },
    {
        id: 'emoji',
        name: 'Emoji Library',
        description: 'Browse, search, and copy thousands of emojis. Supports skin tones and categories.',
        icon: Smile,
        path: '/tool/emoji',
        category: 'Creator',
        usage: 'Browse the infinite scroll of emojis. Click any emoji to copy it instantly. Use the search bar to find specific icons. Toggle skin tones using the hand icon.'
    },
    {
        id: 'watermark',
        name: 'AI Watermark Masker',
        description: 'Remove Nano Banana Pro AI watermarks from images directly in your browser. 100% private.',
        icon: Image,
        path: '/tool/watermark',
        category: 'Creator',
        usage: 'Result images are processed locally. Simply upload your image containing an AI watermark, and the tool will attempt to automatically detect and blur the watermark. You can then download the clean image.'
    },
    {
        id: 'python',
        name: 'Python shell',
        description: 'Write and execute Python code directly in your browser. Powered by WebAssembly.',
        icon: Terminal,
        path: '/tool/python',
        category: 'Developer',
        usage: 'Wait for the Python environment to load. Type standard Python code in the left editor depending on your layout. Click "Run" to execute. The output will appear in the console. Supports standard library imports.'
    },
    {
        id: 'markdown',
        name: 'Markdown Reader and Editor',
        description: 'A distraction-free Markdown editor for writers and bloggers with live visual preview.',
        icon: FileText,
        path: '/tool/markdown',
        category: 'Creator',
        usage: 'Type your markdown text in the editor on the left. The live preview will appear instantly on the right. You can copy the raw markdown or the HTML output.'
    },
    {
        id: 'json',
        name: 'Data Formatter',
        description: 'Clean up, validate, and organize messy JSON data into a readable structure.',
        icon: Braces,
        path: '/tool/json',
        category: 'Developer',
        usage: 'Paste your raw JSON into the input area. Click "Format" to beautify it, or "Validate" to check for syntax errors. You can also minify it for production use.'
    },
    {
        id: 'qr',
        name: 'QR Generator',
        description: 'Instant QR codes for links, menus, or marketing. Fully customizable and high resolution.',
        icon: QrCode,
        path: '/tool/qr',
        category: 'Creator',
        usage: 'Enter the URL or text you want to encode. Customize the foreground and background colors. Adjust the size and error correction level, then download your high-resolution QR code.'
    },
    {
        id: 'color',
        name: 'Color Studio',
        description: 'Pick, convert, and test colors for accessibility. Essential for UI and brand designers.',
        icon: Palette,
        path: '/tool/color',
        category: 'Design',
        usage: 'Select a color using the picker or enter a code (HEX, RGB, HSL). The tool provides conversions, generates shades/tints, and analyzes contrast ratios against white/black backgrounds.'
    },
    {
        id: 'lorem',
        name: 'Content Filler',
        description: 'Generate placeholder text for layouts and mockups. Words, sentences, or paragraphs.',
        icon: Type,
        path: '/tool/lorem',
        category: 'Design',
        usage: 'Choose the type of content you need (paragraphs, sentences, or words) and the quantity. Click "Generate" to create Lorem Ipsum text, then copy it to your clipboard.'
    },
    {
        id: 'base64',
        name: 'Base64 Tool',
        description: 'Encode and decode strings for secure data handling and web development.',
        icon: Code,
        path: '/tool/base64',
        category: 'Developer',
        usage: 'Enter your text in the input box. Choose "Encode" to convert plain text to Base64, or "Decode" to convert Base64 strings back to readable text.'
    },
    {
        id: 'regex',
        name: 'Pattern Tester',
        description: 'Craft and test complex text patterns with real-time matching highlights.',
        icon: Regex,
        path: '/tool/regex',
        category: 'Developer',
        usage: 'Enter your Regular Expression pattern in the top field. Paste your test text below. The tool will highlight all matches in real-time and provide details about capture groups.'
    },
    {
        id: 'diff',
        name: 'File Diff',
        description: 'Compare two versions of text or code side-by-side to find exactly what changed.',
        icon: FileDiff,
        path: '/tool/diff',
        category: 'Utility',
        usage: 'Paste the original text in the left panel and the modified text in the right panel. The tool will highlight added, removed, and modified lines to show you exactly what changed.'
    }
];

export const getToolBySlug = (slug: string): Tool | undefined => {
    return ALL_TOOLS.find((tool) => tool.id === slug);
};
