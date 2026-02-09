# ⚡ AuraEdit v3.0: The Pentagon AI Architect

![AuraEdit Banner](https://capsule-render.vercel.app/api?type=waving&color=0f172a&height=300&section=header&text=AuraEdit%20v3.0&fontSize=90&animation=fadeIn&fontAlignY=38&desc=The%20Infinite%20Mobile%20IDE&descAlignY=51&descAlign=62)

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/AI-Gemini%202.0%20Flash-blue?style=for-the-badge&logo=googlebard)](https://deepmind.google/technologies/gemini/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-white?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**Build Software on your Phone using a 5-Key AI Failover System.**
*No Server. No Limits. Pure Engineering.*

[View Demo](https://auraedit-v3.vercel.app) · [Report Bug](https://github.com/username/auraedit-v3/issues) · [Request Feature](https://github.com/username/auraedit-v3/issues)

</div>

---

## 🧠 What is AuraEdit?

**AuraEdit v3.0** is not just a code editor; it's an **Autonomous Software Factory**. Designed for mobile developers who want to build production-grade applications without a laptop.

It features the **"Pentagon System"**—a custom-built architectural pattern that rotates between **5 Google Gemini API Keys**. If one key hits a rate limit (429), the system automatically hot-swaps to the next key in milliseconds, ensuring **Zero Downtime** during heavy build sessions.

---

## 🚀 Key Features (The "Khatarnak" Stuff)

### 🛡️ The Pentagon API Cascade
A military-grade failover system. 
- **5-Key Rotation:** Automatically switches between 5 distinct API keys.
- **Self-Healing:** If `Key-1` fails, `Key-2` picks up the exact same file instantly.
- **Model Fallback:** Tries **Gemini 2.0 Flash** first, falls back to **1.5 Flash** if needed.

### 👻 Ghost Architect (Bridge)
- **Text-to-Structure:** Paste a simple project tree from any LLM, and AuraEdit instantly creates the entire folder structure in the browser's database.
- **One-Click Build:** The AI sequentially writes code for every empty file in the project.

### 📱 Mobile-First "Desi" UX
- **QuickBar:** A dedicated toolbar for coding symbols (`{ } < > ;`) right above your keyboard.
- **Touch-Optimized Sidebar:** Recursive file tree that handles unlimited nesting depth.
- **PWA Ready:** Install it as a native app on iOS/Android. Works offline.

### 💾 Persistent Browser Database
- **IndexedDB Powered:** Your projects are saved directly in your browser's storage. 
- **Zero Data Loss:** Refresh the page, close the tab—your code stays safe.
- **Export to ZIP:** Download your entire project as a `.zip` file ready for `npm install`.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **AI Engine:** Google Gemini API (Multi-Key Config)
- **State Management:** Zustand
- **Database:** IndexedDB (Client-Side)
- **Editor:** CodeMirror 6 (Custom Mobile Config)
- **Styling:** TailwindCSS + Framer Motion
- **Icons:** RemixIcon

---

## ⚡ Getting Started

### Prerequisites
You need **5 Google Gemini API Keys** (Get them from [Google AI Studio](https://aistudio.google.com/)).

### Installation

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/yourusername/auraedit-v3.git](https://github.com/yourusername/auraedit-v3.git)
   cd auraedit-v3
   
