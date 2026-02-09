import { create } from 'zustand';

const useProjectStore = create((set) => ({
    // --- STATE ---
    project: null,        // Pura Project Structure
    activeFile: null,     // Jo file abhi Editor mein khuli hai
    expandedFolders: {},  // Sidebar mein kaunse folder khule hain
    
    // --- ACTIONS ---
    
    // 1. Project Set karna (Jab DB se load ho ya naya bane)
    setProject: (newProject) => set({ project: newProject }),

    // 2. File Select karna (Editor mein kholne ke liye)
    setActiveFile: (file) => set({ activeFile: file }),

    // 3. File ka Content Update karna (Jab user type kare)
    updateFileContent: (fileId, newContent) => set((state) => {
        if (!state.project) return state;

        // Recursive function to find and update file
        const updateNode = (nodes) => {
            return nodes.map((node) => {
                if (node.id === fileId) {
                    // Update active file too if it's the one being edited
                    if (state.activeFile && state.activeFile.id === fileId) {
                        state.activeFile.content = newContent;
                    }
                    return { ...node, content: newContent };
                }
                if (node.children) {
                    return { ...node, children: updateNode(node.children) };
                }
                return node;
            });
        };

        const updatedRoot = updateNode(state.project.root);
        return { 
            project: { ...state.project, root: updatedRoot },
            // Force re-render of active file content
            activeFile: state.activeFile?.id === fileId 
                ? { ...state.activeFile, content: newContent } 
                : state.activeFile
        };
    }),

    // 4. Folder Toggle (Open/Close)
    toggleFolder: (folderId) => set((state) => ({
        expandedFolders: {
            ...state.expandedFolders,
            [folderId]: !state.expandedFolders[folderId]
        }
    })),
}));

export default useProjectStore;
