import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Define allowed remote image patterns if needed
    remotePatterns: [],
  },

  // Optimize package imports - tree-shake these packages more aggressively
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'react-markdown',
      'prismjs',
    ],
  },

  // Enable compression
  compress: true,

  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header

  // Strict mode for better development experience
  reactStrictMode: true,

  // Generate static pages for better performance
  output: 'standalone',
};

export default nextConfig;
