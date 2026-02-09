/**
 * 🛡️ AURAEDIT PENTAGON CONFIG
 * Ye file seedha .env.local ya Vercel Variables se baat karegi.
 * Yahan keys hardcode MAT karna.
 */

// Keys ko Environment Variables se fetch kar rahe hain
const KEYS = [
    process.env.NEXT_PUBLIC_GEMINI_KEY_1,
    process.env.NEXT_PUBLIC_GEMINI_KEY_2,
    process.env.NEXT_PUBLIC_GEMINI_KEY_3,
    process.env.NEXT_PUBLIC_GEMINI_KEY_4,
    process.env.NEXT_PUBLIC_GEMINI_KEY_5,
];

// Check karein ki keys load hui ya nahi (Debugging ke liye)
if (!KEYS[0]) {
    console.warn("⚠️ API Keys missing! Check .env.local or Vercel Settings.");
}

export const AI_CASCADE = [
    // --- KEY 1 ---
    { id: "Key1-Pro",    model: "gemini-2.0-flash-exp", key: KEYS[0] }, // Latest fast model
    { id: "Key1-Backup", model: "gemini-1.5-flash",     key: KEYS[0] },
    
    // --- KEY 2 ---
    { id: "Key2-Pro",    model: "gemini-2.0-flash-exp", key: KEYS[1] },
    { id: "Key2-Backup", model: "gemini-1.5-flash",     key: KEYS[1] },

    // --- KEY 3 ---
    { id: "Key3-Pro",    model: "gemini-2.0-flash-exp", key: KEYS[2] },
    { id: "Key3-Backup", model: "gemini-1.5-flash",     key: KEYS[2] },

    // --- KEY 4 ---
    { id: "Key4-Pro",    model: "gemini-2.0-flash-exp", key: KEYS[3] },
    { id: "Key4-Backup", model: "gemini-1.5-flash",     key: KEYS[3] },

    // --- KEY 5 ---
    { id: "Key5-Pro",    model: "gemini-2.0-flash-exp", key: KEYS[4] },
    { id: "Key5-Backup", model: "gemini-1.5-flash",     key: KEYS[4] }
];

// --- MASTER SYSTEM PROMPT ---
export const BUILDER_SYSTEM_PROMPT = `
You are the **AuraEdit Master Builder API**. 
Your task is to generate PRODUCTION-READY code for a single file based on the 'Master Blueprint'.

--- 📜 EXECUTION RULES ---
1. **SINGLE FILE ONLY:** Output ONLY the code for the requested file. No markdown, no explanations.
2. **CLEAN ARCHITECTURE:** Use modern syntax (ES6+, React Hooks).
3. **NO CONVERSATION:** Do not say "Here is the code". Just start coding.
`;
