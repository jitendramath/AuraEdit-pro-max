import './globals.css'; // Next step mein banayenge
import { Outfit, JetBrains_Mono } from 'next/font/google';

// --- 1. FONT CONFIGURATION (Next.js Optimization) ---
const outfit = Outfit({ 
    subsets: ['latin'], 
    variable: '--font-outfit',
    display: 'swap',
});

const jetbrains = JetBrains_Mono({ 
    subsets: ['latin'], 
    variable: '--font-jetbrains',
    display: 'swap',
});

// --- 2. SEO & PWA METADATA ---
export const metadata = {
    title: 'AuraEdit v3.0 | Professional Mobile IDE',
    description: 'Build production-ready Node.js & React apps on mobile with AI-powered architecture.',
    manifest: '/manifest.json', // PWA Manifest
    themeColor: '#1e1e2e',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false, // Critical for mobile app feel
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'AuraEdit',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
            <head>
                {/* Remix Icons CDN (Lightweight Icon Pack) */}
                <link 
                    href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" 
                    rel="stylesheet" 
                />
            </head>
            <body className="bg-[#1e1e2e] text-white antialiased overflow-hidden">
                {children}
            </body>
        </html>
    );
}
