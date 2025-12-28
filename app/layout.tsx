import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "NotYourAverage.Tools - The Elite Digital Multitool",
  description: "A curated arsenal of high-performance utilities for modern designers, writers, and developers.",
  keywords: ["tools", "utilities", "developer tools", "design tools", "free tools", "online tools"],
  authors: [{ name: "NotYourAverage.Tools" }],
  openGraph: {
    title: "NotYourAverage.Tools - The Elite Digital Multitool",
    description: "A curated arsenal of high-performance utilities for modern designers, writers, and developers.",
    type: "website",
    siteName: "NotYourAverage.Tools",
  },
  twitter: {
    card: "summary_large_image",
    title: "NotYourAverage.Tools - The Elite Digital Multitool",
    description: "A curated arsenal of high-performance utilities for modern designers, writers, and developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical font files for faster rendering */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        {/* Material Symbols with display=swap for non-blocking load */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
