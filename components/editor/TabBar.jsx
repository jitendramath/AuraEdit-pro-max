import useProjectStore from '@/store/useProjectStore';

export default function TabBar() {
    const { activeFile, updateFileContent } = useProjectStore();

    if (!activeFile) return null;

    return (
        <div className="flex h-10 w-full shrink-0 items-center overflow-x-auto border-b border-[#313244] bg-[#1e1e2e] custom-scrollbar">
            {/* Active Tab */}
            <div className="group flex h-full min-w-[120px] cursor-pointer items-center justify-between border-t-2 border-blue-500 bg-[#1e1e2e] px-3 text-sm text-[#cdd6f4] transition-colors hover:bg-[#313244]">
                <div className="flex items-center gap-2">
                    <i className="ri-file-code-line text-blue-400"></i>
                    <span className="truncate max-w-[100px]">{activeFile.name}</span>
                </div>
                {/* Close Button (Visual only for now) */}
                <button className="ml-2 rounded-md p-1 opacity-0 hover:bg-[#45475a] group-hover:opacity-100">
                    <i className="ri-close-line text-xs"></i>
                </button>
            </div>
            
            {/* Future: Add .map() here for multiple open files */}
        </div>
    );
}
