import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import AgriculturalAIAssistant from "../components/ui/AgriculturalAIAssistant";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "FarmHub - Smart Agriculture Platform",
  description: "Revolutionize your agriculture with AI-powered insights, comprehensive farm management, and cutting-edge technology.",
  keywords: ["farming", "agriculture", "AI", "smart farming", "crop management", "cattle management"],
  authors: [{ name: "FarmHub Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="relative">
          {children}
        </main>
        
        {/* AI Assistant - Available on all pages */}
        <AgriculturalAIAssistant />
        
        {/* Performance monitoring script (optional) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Add any performance monitoring or analytics here
              console.log('FarmHub - Smart Agriculture Platform Loaded');
            `,
          }}
        />
      </body>
    </html>
  );
}
