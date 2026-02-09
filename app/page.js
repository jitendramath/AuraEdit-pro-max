'use client';

import { useState, useEffect } from 'react';
import useProjectStore from '@/store/useProjectStore';

// Components
import Sidebar from '@/components/sidebar/Sidebar';
import EditorArea from '@/components/editor/EditorArea';
import Terminal from '@/components/terminal/Terminal';
import ArchitectModal from '@/components/ai/ArchitectModal';
import BuilderOverlay from '@/components/ai/BuilderOverlay';
import useAIBuilder from '@/hooks/useAIBuilder';

export default function Home() {
  // Mobile par default FALSE (Band rahega)
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [showArchitect, setShowArchitect] = useState(false);

  const { isBuilding, progress, logs, activeKeyId, startBuild, stopBuild } = useAIBuilder();
  const { project } = useProjectStore();

  // Screen size check karne ki zarurat nahi, default false rakha hai upar

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#1e1e2e] text-white">
      
      {/* 1. BUILDER OVERLAY */}
      {isBuilding && (
        <BuilderOverlay 
          progress={progress} 
          logs={logs} 
          activeKeyId={activeKeyId} 
          onStop={stopBuild} 
        />
      )}

      {/* 2. ARCHITECT MODAL */}
      {showArchitect && (
        <ArchitectModal 
          onClose={() => setShowArchitect(false)} 
          onStartBuild={startBuild} 
        />
      )}

      {/* 3. SIDEBAR (MOBILE FIX: Z-Index 50 & Fixed Position) */}
      {isSidebarOpen && (
        <>
            {/* Black Background Backdrop (Click to close) */}
            <div 
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Asli Sidebar Drawer */}
            <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-[#313244] bg-[#1e1e2e] shadow-2xl transition-transform duration-300 md:static md:w-72 md:shadow-none">
                <Sidebar 
                    onClose={() => setSidebarOpen(false)} 
                    onOpenArchitect={() => {
                        setShowArchitect(true);
                        // Mobile par architect khulte hi sidebar band kar do
                        if (window.innerWidth < 768) setSidebarOpen(false);
                    }} 
                />
            </div>
        </>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Mobile Header Button (Hamburger) */}
        {/* Sirf tab dikhega jab Sidebar BAND ho */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-30 md:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#313244] text-white shadow-lg active:scale-95"
            >
              <i className="ri-menu-line text-xl"></i>
            </button>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          <EditorArea />
        </div>

        {/* Terminal Area */}
        {isTerminalOpen && (
          <div className="h-1/3 shrink-0 border-t border-[#313244] relative z-20 bg-[#09090b]">
            <Terminal onClose={() => setTerminalOpen(false)} />
          </div>
        )}

        {/* Footer */}
        <div className="flex h-8 shrink-0 items-center justify-between border-t border-[#313244] bg-[#181825] px-4 text-xs z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="hidden md:block hover:text-blue-400"
            >
              <i className="ri-layout-column-line"></i>
            </button>
            <span>{project ? project.name : 'No Project'}</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTerminalOpen(!isTerminalOpen)}
              className={`flex items-center gap-1 hover:text-blue-400 ${isTerminalOpen ? 'text-blue-400' : ''}`}
            >
              <i className="ri-terminal-box-line"></i>
              TERMINAL
            </button>
          </div>
        </div>

      </div>
    </main>
  );
                }
                
