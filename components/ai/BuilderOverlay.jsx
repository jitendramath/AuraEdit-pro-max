import { useEffect, useRef } from 'react';
import { AI_CASCADE } from '@/lib/ai-cascade-config';

/**
 * 🏗️ BUILDER OVERLAY
 * Displays the real-time progress of the AI construction process.
 * Visualizes the 'Pentagon' key switching and file generation logs.
 */
export default function BuilderOverlay({ progress, logs, activeKeyId, onStop }) {
    const logsEndRef = useRef(null);

    // Auto-scroll logs to bottom
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Calculate Percentage
    const percent = progress.total > 0 
        ? Math.round((progress.current / progress.total) * 100) 
        : 0;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#09090b]/90 backdrop-blur-md">
            
            {/* MAIN CARD */}
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-[#313244] bg-[#1e1e2e] shadow-2xl">
                
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[#313244] bg-[#181825] px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-3 w-3">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
                        </div>
                        <h2 className="font-mono text-lg font-bold text-blue-400 tracking-wider">
                            AURA BUILDER v3.0
                        </h2>
                    </div>
                    <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                        PENTAGON ACTIVE
                    </div>
                </div>

                {/* BODY */}
                <div className="p-8">
                    
                    {/* 1. PROGRESS BAR */}
                    <div className="mb-8">
                        <div className="mb-2 flex justify-between text-sm font-medium text-gray-300">
                            <span>Building: <span className="text-white font-mono">{progress.filename}</span></span>
                            <span>{percent}% ({progress.current}/{progress.total})</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-[#313244]">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* 2. PENTAGON KEY STATUS (The Chakravyuh Visualizer) */}
                    <div className="mb-8 rounded-xl bg-[#11111b] p-4 border border-[#313244]">
                        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500 font-bold">API CASCADE STATUS</p>
                        <div className="flex flex-wrap gap-2">
                            {AI_CASCADE.map((keyConfig) => {
                                const isActive = activeKeyId === keyConfig.id;
                                return (
                                    <div 
                                        key={keyConfig.id}
                                        className={`
                                            flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-mono transition-all duration-300
                                            ${isActive 
                                                ? 'border-blue-500 bg-blue-500/20 text-white shadow-lg shadow-blue-500/10 scale-105' 
                                                : 'border-[#313244] bg-[#181825] text-gray-500 opacity-60'}
                                        `}
                                    >
                                        <i className={`ri-${isActive ? 'cpu-line' : 'checkbox-blank-circle-line'}`}></i>
                                        {keyConfig.id}
                                        {isActive && <span className="animate-pulse">●</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. TERMINAL LOGS */}
                    <div className="h-48 overflow-y-auto rounded-xl bg-black p-4 font-mono text-xs text-gray-300 shadow-inner border border-[#313244] custom-scrollbar">
                        {logs.length === 0 && (
                            <div className="text-gray-600 italic">Initializing build sequence...</div>
                        )}
                        {logs.map((log, idx) => (
                            <div key={idx} className="mb-1 flex gap-2">
                                <span className="text-gray-600">[{log.time}]</span>
                                <span className={`
                                    ${log.type === 'error' ? 'text-red-400' : ''}
                                    ${log.type === 'success' ? 'text-green-400' : ''}
                                    ${log.type === 'warning' ? 'text-yellow-400' : ''}
                                `}>
                                    {log.type === 'success' && '✅ '}
                                    {log.type === 'error' && '❌ '}
                                    {log.type === 'warning' && '⚠️ '}
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                        <div ref={logsEndRef} />
                    </div>

                </div>

                {/* FOOTER */}
                <div className="flex justify-end border-t border-[#313244] bg-[#181825] px-6 py-4">
                    <button 
                        onClick={onStop}
                        className="group flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                        <i className="ri-stop-circle-line text-lg group-hover:scale-110 transition-transform"></i>
                        ABORT MISSION
                    </button>
                </div>

            </div>
        </div>
    );
}
