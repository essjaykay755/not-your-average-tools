
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
} from 'lucide-react';
import { Tool } from '../types';

export const ALL_TOOLS: Tool[] = [
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
