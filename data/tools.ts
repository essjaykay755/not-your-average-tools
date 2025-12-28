
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
    ShieldCheck,
    Crop,
    ArrowLeftRight,
    Keyboard,
    FileImage,
    AppWindow,
    Eye,
    Globe,
    Webhook,
    Binary,
    BookOpen,
    Users,
    Pipette,
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
    },
    {
        id: 'jwt',
        name: 'JWT Decoder',
        description: 'Decode JSON Web Tokens (JWT) to view their header and payload. 100% client-side.',
        icon: ShieldCheck,
        path: '/tool/jwt',
        category: 'Developer',
        usage: 'Paste your JWT token into the input area. The tool will decode the header and payload, showing them in a readable JSON format. It also displays the token expiration time if present.'
    },
    {
        id: 'social-resize',
        name: 'Social Image Resizer',
        description: 'Crop and resize images for Instagram, Twitter, and LinkedIn with one click.',
        icon: Crop,
        path: '/tool/social-resize',
        category: 'Creator',
        usage: 'Upload an image and select a target platform or custom aspect ratio. Drag the crop area to select the best part of the image, then download the resized version.'
    },
    {
        id: 'px-rem',
        name: 'PX to REM Converter',
        description: 'Convert between pixels and REM units relative to your root font size.',
        icon: ArrowLeftRight,
        path: '/tool/px-rem',
        category: 'Designer',
        usage: 'Enter a value in either Pixels or REM. The other field updates instantly. You can also customize the root font size (default is 16px) for accurate conversions.'
    },
    {
        id: 'key-events',
        name: 'Key Events Viewer',
        description: 'Press any key to see its JavaScript event codes (key, code, which) for debugging.',
        icon: Keyboard,
        path: '/tool/key-events',
        category: 'Developer',
        usage: 'Simply press any key on your keyboard. The tool will display a large visual representation of the key along with its default event properties like e.key, e.code, and deprecated e.which.'
    },
    {
        id: 'ico-converter',
        name: 'Image to ICO',
        description: 'Convert PNG or JPG images to .ico format for website favicons. Supports multiple sizes.',
        icon: FileImage,
        path: '/tool/ico-converter',
        category: 'Developer',
        usage: 'Upload an image (PNG/JPG). Select the desired icon sizes (16x16, 32x32, etc.). Download the generated .ico file instantly.'
    },
    {
        id: 'app-icon-generator',
        name: 'App Icon Generator',
        description: 'Generate complete icon packs for Android and iOS from a single high-res image.',
        icon: AppWindow,
        path: '/tool/app-icon-generator',
        category: 'Developer',
        usage: 'Upload a 1024x1024 or larger image. The tool will automatically resize and generate all required icon sizes for Android (mipmap) and iOS (AppIcon). Download as a structured ZIP file.'
    },
    {
        id: 'timestamp',
        name: 'Timestamp Humanizer',
        description: 'Convert Unix timestamps to readable dates and vice versa. Debug time issues instantly.',
        icon: Clock,
        path: '/tool/timestamp',
        category: 'Developer',
        usage: 'Enter a Unix timestamp (seconds or milliseconds) or a date string. The tool converts it to UTC, Local, and relative time formats.'
    },
    {
        id: 'hash',
        name: 'Hash Generator',
        description: 'Create SHA-1 and SHA-256 hashes for file verification and security.',
        icon: ShieldCheck,
        path: '/tool/hash',
        category: 'Security',
        usage: 'Enter text or upload a file. The tool calculates SHA-1 and SHA-256 hashes locally using the browser\'s secure crypto API.'
    },
    {
        id: 'og-preview',
        name: 'Open Graph Preview',
        description: 'Visualize how links appear on X(Twitter), Facebook, and LinkedIn before publishing.',
        icon: Eye,
        path: '/tool/og-preview',
        category: 'Creator',
        usage: 'Enter your page metadata manually to preview how your link will appear on major social platforms. Copy ready-to-use meta tags.'
    },
    {
        id: 'meta-tags',
        name: 'Meta Tag Generator',
        description: 'Generate complete SEO and social meta tags for your website.',
        icon: Globe,
        path: '/tool/meta-tags',
        category: 'Developer',
        usage: 'Fill in page details across Basic SEO, Open Graph, Twitter, and Technical tabs. Copy the generated HTML meta tags.'
    },
    {
        id: 'cors',
        name: 'API Tester',
        description: 'Test REST APIs directly from your browser with custom headers and request body.',
        icon: Globe,
        path: '/tool/cors',
        category: 'Developer',
        usage: 'Enter a URL, select HTTP method, add headers and body. Works with CORS-enabled APIs only (most public APIs).'
    },
    {
        id: 'webhook',
        name: 'Webhook Tester',
        description: 'Inspect incoming webhooks with request headers and body logging.',
        icon: Webhook,
        path: '/tool/webhook',
        category: 'Developer',
        usage: 'Get a unique webhook URL. Use the Simulate button to see how requests appear, or send real requests to inspect.'
    },
    {
        id: 'ascii-art',
        name: 'ASCII Art Generator',
        description: 'Convert any image into retro ASCII art. Adjustable width, character density, and inversion.',
        icon: Binary,
        path: '/tool/ascii-art',
        category: 'Creator',
        usage: 'Upload an image, adjust the output width and character set, then copy or download the ASCII art.'
    },
    {
        id: 'regex-explainer',
        name: 'Regex to English',
        description: 'Paste any regular expression and get a plain English explanation of what it does.',
        icon: BookOpen,
        path: '/tool/regex-explainer',
        category: 'Developer',
        usage: 'Enter a regex pattern. See a token-by-token breakdown with color-coded explanations and a human-readable summary.'
    },
    {
        id: 'fake-data',
        name: 'Fake Data Generator',
        description: 'Generate realistic fake names, emails, addresses, and more for testing. 100% private.',
        icon: Users,
        path: '/tool/fake-data',
        category: 'Developer',
        usage: 'Select how many people to generate. Click to copy individual fields. Export as JSON for your tests.'
    },
    {
        id: 'color-palette',
        name: 'Color Palette Extractor',
        description: 'Extract a beautiful color palette from any image using AI-powered color analysis.',
        icon: Pipette,
        path: '/tool/color-palette',
        category: 'Design',
        usage: 'Upload an image. The tool extracts dominant colors using K-means clustering. Click to copy, or export as CSS variables.'
    }
];

export const getToolBySlug = (slug: string): Tool | undefined => {
    return ALL_TOOLS.find((tool) => tool.id === slug);
};
