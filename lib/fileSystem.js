import JSZip from 'jszip'; // Make sure to run: npm install jszip

/**
 * 🧠 AURAFS (v3.0 - Next.js Edition)
 * The persistent brain of AuraEdit. Handles IndexedDB and File Operations.
 */

const DB_NAME = "AuraEditDB_v3";
const STORE_NAME = "projects";

export const AuraFS = {
    // === STATE ===
    project: {
        id: null,
        name: null,
        type: null, 
        root: []
    },

    // === 1. PRODUCTION TEMPLATES ===
    templates: {
        vanilla: {
            "index.html": "<!DOCTYPE html>\n<html lang='en'>\n<head>\n  <meta charset='UTF-8'>\n  <meta name='viewport' content='width=device-width, initial-scale=1.0'>\n  <title>Aura App</title>\n  <link rel='stylesheet' href='style.css'>\n</head>\n<body>\n  <div id='app'>\n    <h1>Hello Aura</h1>\n  </div>\n  <script src='script.js'></script>\n</body>\n</html>",
            "style.css": "body { background: #1e1e2e; color: #fff; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }",
            "script.js": "console.log('AuraEdit v3 Running...');"
        },
        react: {
            "package.json": JSON.stringify({ name: "react-app", version: "1.0.0", type: "module", dependencies: { "react": "^18.2.0", "react-dom": "^18.2.0" }, scripts: { "dev": "vite", "build": "vite build" } }, null, 2),
            "vite.config.js": "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });",
            "index.html": "<!doctype html>\n<html lang='en'>\n  <body>\n    <div id='root'></div>\n    <script type='module' src='/src/main.jsx'></script>\n  </body>\n</html>",
            "src": {
                "main.jsx": "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App.jsx';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);",
                "App.jsx": "import { useState } from 'react';\nimport './App.css';\nexport default function App() { return <h1>Hello Aura React</h1>; }",
                "App.css": "body { background: #222; color: white; }",
                "components": {}
            }
        },
        node: {
            "package.json": JSON.stringify({ name: "node-api", main: "server.js", dependencies: { "express": "^4.18.2" } }, null, 2),
            "server.js": "const express = require('express');\nconst app = express();\napp.get('/', (req, res) => res.json({ msg: 'Aura Node API' }));\napp.listen(3000, () => console.log('Server running on 3000'));"
        }
    },

    // === 2. INITIALIZATION ===
    async init() {
        if (typeof window === 'undefined') return null; // SSR Guard
        const saved = await this.loadFromDB();
        if (saved) {
            this.project = saved;
        }
        return this.project;
    },

    // === 3. PROJECT GENERATOR ===
    async createProject(type, name) {
        if (!this.templates[type]) {
            console.error("Invalid template type:", type);
            return null;
        }

        this.project = {
            id: Date.now(),
            name: name || `my-${type}-app`,
            type: type,
            root: []
        };

        const parse = (obj, parentArray) => {
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    parentArray.push({
                        id: this.generateId(),
                        name: key,
                        type: 'file',
                        content: value,
                        isOpen: false
                    });
                } else {
                    const folder = {
                        id: this.generateId(),
                        name: key,
                        type: 'folder',
                        children: [],
                        isOpen: true
                    };
                    parentArray.push(folder);
                    parse(value, folder.children);
                }
            }
        };

        parse(this.templates[type], this.project.root);
        await this.saveToDB();
        return this.project;
    },

    // === 4. AI STRUCTURE PARSER (The Architect's Interpreter) ===
    async parseAIStructure(text) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return;

        this.project = {
            id: Date.now(),
            name: "ai-generated-project",
            type: 'ai-custom',
            root: []
        };

        const stack = [{ depth: -1, children: this.project.root }];

        lines.forEach(line => {
            const depth = line.search(/\w|(?:\.[a-zA-Z0-9]+)/);
            const cleanName = line.replace(/[├└│─|]/g, '').trim();
            if (!cleanName) return;

            const isFolder = cleanName.endsWith('/') || !cleanName.includes('.');
            const nodeName = cleanName.replace(/\/$/, '');

            const newNode = {
                id: this.generateId(),
                name: nodeName,
                type: isFolder ? 'folder' : 'file',
                ...(isFolder ? { children: [], isOpen: true } : { content: `// Waiting for Aura Builder to write code...`, isOpen: false })
            };

            while (stack.length > 1 && stack[stack.length - 1].depth >= depth) {
                stack.pop();
            }

            stack[stack.length - 1].children.push(newNode);

            if (isFolder) {
                stack.push({ depth: depth, children: newNode.children });
            }
        });

        await this.saveToDB();
        return this.project;
    },

    // === 5. CRUD OPERATIONS ===
    
    findNode(id, list = this.project.root) {
        for (const node of list) {
            if (node.id === id) return node;
            if (node.children) {
                const found = this.findNode(id, node.children);
                if (found) return found;
            }
        }
        return null;
    },

    async updateFile(id, content) {
        const node = this.findNode(id);
        if (node && node.type === 'file') {
            node.content = content;
            await this.saveToDB();
        }
    },

    // === 6. DATABASE (IndexedDB) ===
    getDB() {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, 3);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
            };
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    },

    async saveToDB() {
        if (typeof window === 'undefined') return;
        const db = await this.getDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(this.project, "activeProject");
    },

    async loadFromDB() {
        if (typeof window === 'undefined') return null;
        const db = await this.getDB();
        return new Promise((resolve) => {
            const tx = db.transaction(STORE_NAME, "readonly");
            const req = tx.objectStore(STORE_NAME).get("activeProject");
            req.onsuccess = () => resolve(req.result);
        });
    },

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
};
