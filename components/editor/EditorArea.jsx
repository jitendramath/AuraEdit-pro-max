import { useMemo } from 'react';
import useProjectStore from '@/store/useProjectStore';

// --- SUB-COMPONENTS (Hum agle steps mein banayenge) ---
import CodeMirrorEditor from './CodeMirrorEditor';
import QuickBar from './QuickBar';

/**
 * 📝 EDITOR AREA (Container)
 * Manages the layout for the active file editor, tabs, and mobile tools.
 */
export default function EditorArea() {
    const { activeFile, updateFileContent } = useProjectStore();

    // --- EMPTY STATE (Welcome Screen) ---
    if (!activeFile) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#1e1e2e] text-[#585b70]">
                <div className="mb-4 rounded-2xl bg-[#313244]/30 p-6">
                    <i className="ri-code-s-slash-line text-6xl opacity-50"></i>
                </div>
                <h2 className="text-xl font-bold tracking-wide text-[#cdd6f4]">AURA EDIT v3.0</h2>
                <p className="mt-2 text-sm text-[#a6accd]">Select a file to start coding</p>
                
                <div className="mt-8 flex gap-4 text-xs">
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-[#313244] px-2 py-1 text-gray-300">CTRL+S</span>
                        <span>Save</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="rounded bg-[#313244] px-2 py-1 text-gray-300">AI</span>
                        <span>Architect</span>
                    </div>
                </div>
            </div>
        );
    }

    // --- ACTIVE EDITOR LAYOUT ---
    return (
        <div className="flex h-full w-full flex-col bg-[#1e1e2e]">
            
            {/* 1. FILE TAB HEADER */}
            <div className="flex h-10 shrink-0 items-center border-b border-[#313244] bg-[#1e1e2e] overflow-x-auto">
                <div className="flex h-full items-center gap-2 border-t-2 border-blue-500 bg-[#1e1e2e] px-4 pr-6 text-sm text-[#cdd6f4]">
                    <i className="ri-file-code-line text-blue-400"></i>
                    <span className="font-medium">{activeFile.name}</span>
                    <button 
                        className="ml-2 rounded-full p-0.5 text-[#585b70] hover:bg-[#313244] hover:text-white"
                        onClick={() => {/* Close logic if needed */}}
                    >
                        <i className="ri-close-line"></i>
                    </button>
                </div>
                {/* Future: Map through 'openFiles' array here for multi-tabs */}
            </div>

            {/* 2. CODE EDITOR (The Core) */}
            <div className="relative flex-1 overflow-hidden">
                <CodeMirrorEditor 
                    fileId={activeFile.id}
                    fileName={activeFile.name}
                    initialContent={activeFile.content}
                    onChange={(newContent) => updateFileContent(activeFile.id, newContent)}
                />
            </div>

            {/* 3. MOBILE QUICK BAR (Symbols) */}
            <div className="shrink-0 border-t border-[#313244] bg-[#181825]">
                <QuickBar />
            </div>

            {/* 4. STATUS BAR */}
            <div className="flex h-6 shrink-0 items-center justify-between bg-blue-600 px-3 text-[10px] font-bold text-white md:text-xs">
                <div className="flex items-center gap-4">
                    <span>
                        <i className="ri-git-branch-line mr-1"></i>
                        MAIN
                    </span>
                    <span>
                        {activeFile.name.toUpperCase()}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="hidden md:inline">UTF-8</span>
                    <span>JAVASCRIPT</span>
                    <span>Ln 1, Col 1</span>
                </div>
            </div>

        </div>
    );
}
