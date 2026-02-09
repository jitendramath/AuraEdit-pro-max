/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // In files ko scan karke unused CSS hatayega (Purge)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      // 1. FONTS: Jo humne layout.js mein variables banaye the
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      // 2. COLORS: Agar future mein hex codes baar-baar nahi likhne ho
      colors: {
        aura: {
          bg: '#1e1e2e',       // Editor Background
          sidebar: '#181825',  // Sidebar/Header
          border: '#313244',   // Borders
          text: '#cdd6f4',     // Main Text
          muted: '#a6accd',    // Secondary Text
          accent: '#3b82f6',   // Blue Highlight
        }
      },
      // 3. ANIMATIONS: Custom keyframes
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};
