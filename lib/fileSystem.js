import { openDB } from 'idb';

const DB_NAME = 'aura-fs-v3';
const STORE_NAME = 'files';

// Initialize Database
export const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        },
    });
};

export const AuraFS = {
    // 🧠 SMART PARSER (Fixes "Error Parsing Blueprint")
    parseAIStructure: async (text) => {
        const root = [];
        const lines = text.split('\n');
        
        // Helper to find or create folder
        const getFolder = (parentArray, name) => {
            let folder = parentArray.find(n => n.name === name && n.type === 'folder');
            if (!folder) {
                folder = { 
                    id: Math.random().toString(36).substr(2, 9), 
                    name, 
                    type: 'folder', 
                    children: [] 
                };
                parentArray.push(folder);
            }
            return folder;
        };

        lines.forEach(line => {
            // Clean the line: Remove symbols like │, ├──, └── and spaces
            const cleanPath = line.replace(/[│├└─\s]/g, '').trim();
            if (!cleanPath) return;

            // Handle standard paths (e.g., "src/components/Header.jsx")
            const parts = cleanPath.split('/');
            let currentLevel = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1 && part.includes('.');
                
                if (isFile) {
                    currentLevel.push({
                        id: Math.random().toString(36).substr(2, 9),
                        name: part,
                        type: 'file',
                        content: '' // Empty initially
                    });
                } else {
                    const folder = getFolder(currentLevel, part);
                    currentLevel = folder.children;
                }
            });
        });

        // Fallback: Agar upar wala logic fail ho jaye, toh basic tree banaye
        if (root.length === 0) {
            console.warn("Parsing failed via path, trying simple extraction...");
            root.push({
                id: 'root-fallback',
                name: 'src',
                type: 'folder',
                children: [
                    { id: 'f1', name: 'App.jsx', type: 'file', content: '' },
                    { id: 'f2', name: 'index.css', type: 'file', content: '' }
                ]
            });
        }

        return root;
    },

    saveProject: async (projectData) => {
        const db = await initDB();
        await db.put(STORE_NAME, projectData);
    },

    getProject: async (id) => {
        const db = await initDB();
        return await db.get(STORE_NAME, id);
    }
};
