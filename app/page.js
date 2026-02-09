"use client";

import { useEffect, useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import useAIBuilder from '@/hooks/useAIBuilder';

// --- COMPONENTS (Hum next steps mein banayenge) ---
// Temporary placeholders use mat karna, hum asli components banayenge.
import Sidebar from '@/components/sidebar/Sidebar';
import EditorArea from '@/components/editor/EditorArea';
import ArchitectModal from '@/components/ai/ArchitectModal';
import BuilderOverlay from '@/components/ai/BuilderOverlay';

export default function Home() {
    // --- GLOBAL STATE ---
    const { init, isLoading, project } = useProjectStore();
    const builder = useAIBuilder(); // Hook for the Pentagon Builder logic

    // --- LOCAL UI STATE ---
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showArchitect, setShowArchitect] = useState(false);

    // --- INITIALIZATION ---
    useEffect(() => {
        init(); // Load project from IndexedDB
    }, []);

    // --- LOADING SCREEN ---
    if (isLoading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#1e1e2e] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                    <p className="font-mono text-sm tracking-widest">AURAEDIT v3.0 LOADING...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex h-screen w-screen bg-[#1e1e2e] text-[#cdd6f4] overflow-hidden font-sans">
            
            {/* 1. LEFT SIDEBAR (File Tree) */}
            <div 
                className={`
                    fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[#313244] bg-[#1e1e2e] transition-transform duration-300 md:relative md:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <Sidebar 
                    onClose={() => setSidebarOpen(false)} 
                    onOpenArchitect={() => setShowArchitect(true)} 
                />
            </div>

            {/* 2. MAIN EDITOR AREA */}
            <div className="flex flex-1 flex-col overflow-hidden relative">
                
                {/* Mobile Header / Toolbar */}
                <header className="flex h-12 items-center justify-between border-b border-[#313244] bg-[#1e1e2e] px-4 md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-white">
                        <i className="ri-menu-line text-xl"></i>
                    </button>
                    <span className="font-bold text-blue-400">AuraEdit</span>
                    <button onClick={() => setShowArchitect(true)} className="text-blue-400">
                        <i className="ri-magic-line text-xl"></i>
                    </button>
                </header>

                {/* The Code Editor */}
                <EditorArea />

            </div>

            {/* 3. MODALS & OVERLAYS */}
            
            {/* The "AI Magic" Modal (For pasting Blueprints) */}
            {showArchitect && (
                <ArchitectModal 
                    onClose={() => setShowArchitect(false)} 
                    onStartBuild={builder.startBuild} 
                />
            )}

            {/* The "Builder Progress" Overlay (When AI is writing code) */}
            {builder.isBuilding && (
                <BuilderOverlay 
                    progress={builder.progress} 
                    logs={builder.logs} 
                    activeKeyId={builder.activeKeyId}
                    onStop={builder.stopBuild}
                />
            )}

        </main>
    );
}
