import { useMemo } from 'react';
import useProjectStore from '@/store/useProjectStore';
import QuickBar from './QuickBar';

// ✅ NEW: Dynamic Import (SSR: false)
// Ye server ko CodeMirror load karne se rokega
import dynamic from 'next/dynamic';
const CodeMirrorEditor = dynamic(() => import('./CodeMirrorEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-[#1e1e2e] text-gray-500">
            <i className="ri-loader-4-line animate-spin text-2xl"></i>
        </div>
    ),
});

export default function EditorArea() {
    const { activeFile, updateFileContent } = useProjectStore();

    // --- EMPTY STATE ---
    if (!activeFile) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[#1e1e2e] text-[#585b70]">
                <div className="mb-4 rounded-2xl bg-[#313244]/30 p-6">
                    <i className="ri-code-s-slash-line text-6xl opacity-50"></i>
                </div>
                <h2 className="text-xl font-bold tracking-wide text-[#cdd6f4]">AURA EDIT v3.0</h2>
                <p className="mt-2 text-sm text-[#a6accd]">Select a file to start coding</p>
            </div>
        );
    }

    // --- ACTIVE EDITOR ---
    return (
        <div className="flex h-full w-full flex-col bg-[#1e1e2e]">
            {/* Header */}
            <div className="flex h-10 shrink-0 items-center border-b border-[#313244] bg-[#1e1e2e]">
                <div className="flex h-full items-center gap-2 border-t-2 border-blue-500 bg-[#1e1e2e] px-4 pr-6 text-sm text-[#cdd6f4]">
                    <i className="ri-file-code-line text-blue-400"></i>
                    <span className="font-medium">{activeFile.name}</span>
                </div>
            </div>

            {/* CodeMirror (Client Only) */}
            <div className="relative flex-1 overflow-hidden">
                <CodeMirrorEditor 
                    fileId={activeFile.id}
                    fileName={activeFile.name}
                    initialContent={activeFile.content}
                    onChange={(newContent) => updateFileContent(activeFile.id, newContent)}
                />
            </div>

            {/* QuickBar */}
            <div className="shrink-0 border-t border-[#313244] bg-[#181825]">
                <QuickBar />
            </div>

            {/* Footer */}
            <div className="flex h-6 shrink-0 items-center justify-between bg-blue-600 px-3 text-[10px] font-bold text-white">
                <div className="flex items-center gap-4">
                    <span>MAIN</span>
                    <span>{activeFile.name.toUpperCase()}</span>
                </div>
                <div>UTF-8</div>
            </div>
        </div>
    );
}
