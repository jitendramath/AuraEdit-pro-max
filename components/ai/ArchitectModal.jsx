'use client';

import { useState } from 'react';
import { AuraFS } from '@/lib/fileSystem';
import useProjectStore from '@/store/useProjectStore';

/**
 * 🧠 ARCHITECT MODAL
 * Accepts the text blueprint from Gemini/ChatGPT and converts it into a file structure.
 */
export default function ArchitectModal({ onClose, onStartBuild }) {
    const [blueprint, setBlueprint] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const { setProject } = useProjectStore();

    const handleProcess = async () => {
        if (!blueprint.trim()) return;
        setIsParsing(true);

        try {
            // 1. Parse the AI Text into a File System Structure
            console.log("Parsing blueprint...");
            const root = await AuraFS.parseAIStructure(blueprint);
            
            if (!root || root.length === 0) {
                alert("Could not parse structure. Make sure format is correct.");
                setIsParsing(false);
                return;
            }

            // 2. Save to Project Store
            const projectData = {
                id: Date.now().toString(),
                name: root[0]?.name || 'Aura Project',
                root: root
            };
            
            setProject(projectData);
            console.log("Project structure saved:", projectData);

            // 3. Identify Empty Files for the Builder Queue
            const queue = [];
            const findEmptyFiles = (nodes) => {
                nodes.forEach(node => {
                    // Agar file hai aur content khali hai, toh queue mein daalo
                    if (node.type === 'file' && (!node.content || node.content.trim() === '')) {
                        queue.push(node);
                    }
                    if (node.children) findEmptyFiles(node.children);
                });
            };
            findEmptyFiles(root);

            console.log(`Found ${queue.length} files to build.`);

            // 4. Start the Pentagon Builder
            onStartBuild(queue, blueprint);
            onClose();

        } catch (error) {
            console.error("Parsing Failed:", error);
            alert("Error parsing blueprint. Check console for details.");
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#313244] bg-[#1e1e2e] shadow-2xl animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                            <i className="ri-magic-line text-xl"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">AI Architect</h2>
                            <p className="text-xs text-gray-400">Paste your Gemini/ChatGPT Blueprint</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-[#313244] hover:text-white">
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <textarea 
                        value={blueprint}
                        onChange={(e) => setBlueprint(e.target.value)}
                        placeholder={`Paste file tree here (Example):\n\nMyApp/\n├── src/\n│   ├── App.jsx\n│   └── main.jsx\n└── package.json`}
                        className="h-64 w-full rounded-xl border border-[#313244] bg-[#11111b] p-4 font-mono text-xs text-gray-300 placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none custom-scrollbar"
                        spellCheck="false"
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-[#313244] bg-[#181825] px-6 py-4">
                    <button 
                        onClick={onClose}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#313244]"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleProcess}
                        disabled={isParsing || !blueprint.trim()}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                        {isParsing ? (
                            <>
                                <i className="ri-loader-4-line animate-spin"></i>
                                Parsing...
                            </>
                        ) : (
                            <>
                                <i className="ri-cpu-line"></i>
                                Initialize Project
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
                        }
