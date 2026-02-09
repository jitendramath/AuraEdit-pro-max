import { useState, useEffect, useRef } from 'react';
import useProjectStore from '@/store/useProjectStore';

/**
 * 📟 AURA TERMINAL (v3.0)
 * A simulated shell environment for the mobile IDE.
 * Supports basic file system commands and simulated build processes.
 */
export default function Terminal({ onClose }) {
    const { project } = useProjectStore();
    const [history, setHistory] = useState([
        { type: 'info', text: 'AuraEdit v3.0 Shell [Version 1.0.0]' },
        { type: 'info', text: 'Copyright (c) 2026 Jitendra Singh. All rights reserved.' },
        { type: 'success', text: 'Type "help" for available commands.' },
    ]);
    const [input, setInput] = useState('');
    const bottomRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    /**
     * 🧠 COMMAND PARSER
     * Decodes user input and executes logic.
     */
    const handleCommand = (e) => {
        if (e.key !== 'Enter') return;

        const cmd = input.trim();
        if (!cmd) return;

        // Add command to history
        const newHistory = [...history, { type: 'command', text: cmd }];
        setInput('');

        const args = cmd.split(' ');
        const mainCmd = args[0].toLowerCase();

        // --- COMMAND LOGIC ---
        switch (mainCmd) {
            case 'help':
                newHistory.push({ type: 'info', text: 'Available commands:' });
                newHistory.push({ type: 'info', text: '  ls          List files in root' });
                newHistory.push({ type: 'info', text: '  clear       Clear terminal' });
                newHistory.push({ type: 'info', text: '  npm start   Start dev server (Simulated)' });
                newHistory.push({ type: 'info', text: '  git status  Check version control' });
                newHistory.push({ type: 'info', text: '  whoami      Display current user' });
                break;

            case 'clear':
                setHistory([]);
                return; // Special case: return early

            case 'ls':
                if (project && project.root) {
                    const files = project.root.map(n => 
                        n.type === 'folder' ? `${n.name}/` : n.name
                    ).join('  ');
                    newHistory.push({ type: 'output', text: files });
                } else {
                    newHistory.push({ type: 'error', text: 'No active project.' });
                }
                break;

            case 'npm':
                if (args[1] === 'start') {
                    newHistory.push({ type: 'success', text: '> react-scripts start' });
                    newHistory.push({ type: 'info', text: 'Starting the development server...' });
                    newHistory.push({ type: 'warning', text: 'Compiled successfully!' });
                    newHistory.push({ type: 'success', text: 'You can now view your app in the preview tab.' });
                } else if (args[1] === 'install') {
                    newHistory.push({ type: 'info', text: 'added 145 packages in 2s' });
                } else {
                    newHistory.push({ type: 'error', text: `npm command '${args[1]}' not found.` });
                }
                break;

            case 'git':
                if (args[1] === 'status') {
                    newHistory.push({ type: 'info', text: 'On branch main' });
                    newHistory.push({ type: 'info', text: 'nothing to commit, working tree clean' });
                } else {
                    newHistory.push({ type: 'error', text: `git: '${args[1]}' is not a git command.` });
                }
                break;

            case 'whoami':
                newHistory.push({ type: 'success', text: 'root@jitendra-singh' });
                break;

            default:
                newHistory.push({ type: 'error', text: `bash: ${mainCmd}: command not found` });
        }

        setHistory(newHistory);
    };

    return (
        <div className="flex h-full w-full flex-col bg-[#09090b] font-mono text-xs md:text-sm text-gray-300">
            
            {/* 1. HEADER */}
            <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#313244] bg-[#181825] px-4">
                <div className="flex items-center gap-2">
                    <i className="ri-terminal-box-line text-green-400"></i>
                    <span className="font-bold">TERMINAL</span>
                </div>
                <button onClick={onClose} className="hover:text-white">
                    <i className="ri-close-line text-lg"></i>
                </button>
            </div>

            {/* 2. OUTPUT AREA */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {history.map((line, idx) => (
                    <div key={idx} className="mb-1 break-words">
                        {line.type === 'command' && (
                            <span className="mr-2 text-green-400 font-bold">➜  ~</span>
                        )}
                        <span className={`
                            ${line.type === 'command' ? 'text-white font-bold' : ''}
                            ${line.type === 'error' ? 'text-red-400' : ''}
                            ${line.type === 'success' ? 'text-green-400' : ''}
                            ${line.type === 'warning' ? 'text-yellow-400' : ''}
                            ${line.type === 'output' ? 'text-blue-300' : ''}
                        `}>
                            {line.text}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* 3. INPUT LINE */}
            <div className="flex h-10 shrink-0 items-center border-t border-[#313244] bg-[#09090b] px-4">
                <span className="mr-2 text-green-400 font-bold">➜</span>
                <span className="mr-2 text-blue-400 font-bold">~</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                    className="flex-1 bg-transparent text-white outline-none placeholder-gray-600"
                    placeholder="Type a command..."
                />
            </div>

        </div>
    );
}
