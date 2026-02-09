import './globals.css';
import { Outfit, JetBrains_Mono } from 'next/font/google';

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

// ✅ NEW: Viewport settings alag export karni hain
export const viewport = {
    themeColor: '#1e1e2e',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export const metadata = {
    title: 'AuraEdit v3.0 | Professional Mobile IDE',
    description: 'Build production-ready Node.js & React apps on mobile.',
    manifest: '/manifest.json',
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
