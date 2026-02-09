import { useState } from 'react';
import useProjectStore from '@/store/useProjectStore';
import JSZip from 'jszip';

/**
 * 🌲 RECURSIVE TREE NODE
 */
const FileTreeNode = ({ node, level, activeFileId, expandedFolders, onToggle, onSelect }) => {
    const isFolder = node.type === 'folder';
    const isOpen = expandedFolders[node.id];
    const isActive = activeFileId === node.id;
    const paddingLeft = `${level * 12 + 12}px`;

    const getIcon = (name, type, open) => {
        if (type === 'folder') return open ? 'ri-folder-open-fill text-yellow-400' : 'ri-folder-fill text-yellow-400';
        if (name.endsWith('jsx')) return 'ri-reactjs-line text-cyan-400';
        if (name.endsWith('js')) return 'ri-javascript-line text-yellow-300';
        if (name.endsWith('css')) return 'ri-css3-line text-blue-400';
        if (name.endsWith('html')) return 'ri-html5-line text-orange-500';
        if (name.endsWith('json')) return 'ri-braces-line text-green-400';
        return 'ri-file-text-line text-gray-400';
    };

    return (
        <div className="select-none">
            <div 
                className={`
                    group flex cursor-pointer items-center gap-2 py-1.5 text-sm transition-colors
                    ${isActive ? 'bg-[#313244] text-white border-l-2 border-blue-500' : 'text-gray-400 hover:bg-[#313244]/50 hover:text-gray-200 border-l-2 border-transparent'}
                `}
                style={{ paddingLeft }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isFolder) onToggle(node.id);
                    else onSelect(node);
                }}
            >
                <i className={`${getIcon(node.name, node.type, isOpen)} text-lg`}></i>
                <span className="truncate">{node.name}</span>
            </div>

            {isFolder && isOpen && node.children && (
                <div>
                    {node.children.map(child => (
                        <FileTreeNode 
                            key={child.id} 
                            node={child} 
                            level={level + 1}
                            activeFileId={activeFileId}
                            expandedFolders={expandedFolders}
                            onToggle={onToggle}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * 🗂️ MAIN SIDEBAR COMPONENT
 */
export default function Sidebar({ onClose, onOpenArchitect }) {
    const { project, activeFile, expandedFolders, toggleFolder, setActiveFile } = useProjectStore();
    const [isExporting, setIsExporting] = useState(false);

    // --- DOWNLOAD ZIP LOGIC ---
    const handleDownload = async () => {
        if (!project) return;
        setIsExporting(true);
        try {
            const zip = new JSZip();
            const addToZip = (folder, nodes) => {
                nodes.forEach(node => {
                    if (node.type === 'folder') {
                        const newFolder = folder.folder(node.name);
                        if (node.children) addToZip(newFolder, node.children);
                    } else {
                        folder.file(node.name, node.content || "");
                    }
                });
            };

            addToZip(zip, project.root);
            const content = await zip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export Failed", error);
            alert("Export Failed!");
        } finally {
            setIsExporting(false);
        }
    };

    // 🚨 FIX: Removed 'if (!project) return null;' logic here!
    
    return (
        <div className="flex h-full w-full flex-col bg-[#1e1e2e] text-[#a6accd]">
            
            {/* 1. HEADER */}
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#313244] px-4">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                    EXPLORER
                </span>
                <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                    <i className="ri-menu-fold-line text-lg"></i>
                </button>
            </div>

            {/* 2. PROJECT NAME SECTION */}
            <div className="flex items-center gap-2 border-b border-[#313244] px-4 py-3 bg-[#181825]">
                <i className="ri-hard-drive-2-line text-blue-500"></i>
                <span className="font-bold text-white truncate">
                    {project ? project.name : "No Project Active"}
                </span>
            </div>

            {/* 3. FILE TREE (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                {!project || !project.root || project.root.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center opacity-60">
                        <div className="mb-4 rounded-full bg-[#313244] p-4">
                            <i className="ri-lightbulb-flash-line text-3xl text-yellow-400"></i>
                        </div>
                        <p className="text-sm font-medium text-gray-300">Start Building</p>
                        <p className="text-xs text-gray-500 mt-1">Use the AI Architect below to generate your first project.</p>
                    </div>
                ) : (
                    project.root.map(node => (
                        <FileTreeNode 
                            key={node.id} 
                            node={node} 
                            level={0}
                            activeFileId={activeFile?.id}
                            expandedFolders={expandedFolders}
                            onToggle={toggleFolder}
                            onSelect={setActiveFile}
                        />
                    ))
                )}
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="shrink-0 border-t border-[#313244] bg-[#181825] p-3 flex flex-col gap-2">
                
                {/* AI Architect Button (ALWAYS VISIBLE NOW) */}
                <button 
                    onClick={onOpenArchitect}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-900/20"
                >
                    <i className="ri-magic-line text-sm"></i>
                    AI ARCHITECT
                </button>

                {/* Export Button (Disabled if no project) */}
                <button 
                    onClick={handleDownload}
                    disabled={!project || isExporting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#313244] px-3 py-2 text-xs font-medium text-gray-300 transition-all hover:bg-[#45475a] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting ? <i className="ri-loader-4-line animate-spin"></i> : <i className="ri-download-cloud-2-line"></i>}
                    DOWNLOAD ZIP
                </button>
            </div>

        </div>
    );
        }
                        
