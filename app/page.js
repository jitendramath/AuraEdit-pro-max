'use client'; // 👈 YE SABSE ZARURI HAI

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
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [showArchitect, setShowArchitect] = useState(false);

  // AI Builder Hook
  const { isBuilding, progress, logs, activeKeyId, startBuild, stopBuild } = useAIBuilder();
  const { project } = useProjectStore();

  // Mobile check for initial sidebar state
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#1e1e2e] text-white">
      
      {/* 1. BUILDER OVERLAY (Jab AI kaam karega tab dikhega) */}
      {isBuilding && (
        <BuilderOverlay 
          progress={progress} 
          logs={logs} 
          activeKeyId={activeKeyId} 
          onStop={stopBuild} 
        />
      )}

      {/* 2. ARCHITECT MODAL (AI Prompt Box) */}
      {showArchitect && (
        <ArchitectModal 
          onClose={() => setShowArchitect(false)} 
          onStartBuild={startBuild} 
        />
      )}

      {/* 3. SIDEBAR (Left Panel) */}
      {isSidebarOpen && (
        <div className="h-full w-64 shrink-0 border-r border-[#313244] md:w-72">
          <Sidebar 
            onClose={() => setSidebarOpen(false)} 
            onOpenArchitect={() => setShowArchitect(true)} 
          />
        </div>
      )}

      {/* 4. MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        
        {/* Mobile Header (Hamburger Menu) */}
        {!isSidebarOpen && (
          <div className="absolute top-4 left-4 z-50 md:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="rounded-md bg-[#313244] p-2 text-white shadow-lg"
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          <EditorArea />
        </div>

        {/* Terminal (Bottom Panel) */}
        {isTerminalOpen && (
          <div className="h-1/3 shrink-0 border-t border-[#313244]">
            <Terminal onClose={() => setTerminalOpen(false)} />
          </div>
        )}

        {/* Footer / Status Bar */}
        <div className="flex h-8 shrink-0 items-center justify-between border-t border-[#313244] bg-[#181825] px-4 text-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)} 
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
            <span className="flex items-center gap-1">
              <i className="ri-wifi-line text-green-400"></i>
              Online
            </span>
          </div>
        </div>

      </div>
    </main>
  );
            }
                  
