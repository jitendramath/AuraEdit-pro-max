/**
 * ⚡ QUICK BAR (Mobile Helper)
 * A scrollable toolbar for commonly used coding symbols.
 * Critical for mobile productivity where special chars are hard to reach.
 */
export default function QuickBar() {
    
    // The "Desi" Symbol List
    const symbols = [
        '{', '}', '(', ')', '[', ']', 
        '<', '>', '=', ';', '"', "'", 
        '`', '$', '!', '/', ':', '=>'
    ];

    /**
     * 💉 INJECT SYMBOL
     * Finds the active CodeMirror instance via DOM and inserts text.
     * This avoids passing refs through 5 layers of components.
     */
    const handleInsert = (sym) => {
        // 1. Find the editor instance attached to the DOM
        const cmElement = document.querySelector('.CodeMirror');
        
        if (cmElement && cmElement.CodeMirror) {
            const doc = cmElement.CodeMirror.getDoc();
            const cursor = doc.getCursor();
            
            // 2. Insert Symbol
            doc.replaceRange(sym, cursor);
            
            // 3. Refocus Editor (Mobile keyboard stays up)
            cmElement.CodeMirror.focus();
            
            // 4. Move Cursor (If it's a bracket pair like {}, move inside)
            // Optional Logic: if sym is '{', move cursor back? 
            // For now, keep it simple: insert and stay.
        }
    };

    return (
        <div className="flex h-12 w-full items-center bg-[#181825] px-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
            
            <div className="flex w-full gap-2 overflow-x-auto custom-scrollbar pb-1 pt-1">
                {symbols.map((sym) => (
                    <button
                        key={sym}
                        onClick={(e) => {
                            e.preventDefault(); // Prevent focus loss
                            handleInsert(sym);
                        }}
                        className="
                            flex h-9 min-w-[36px] items-center justify-center rounded-lg 
                            border border-[#313244] bg-[#313244]/50 
                            font-mono text-sm font-bold text-[#cdd6f4] 
                            transition-all hover:bg-blue-600 hover:text-white hover:border-blue-500
                            active:scale-95 active:bg-blue-700
                        "
                    >
                        {sym}
                    </button>
                ))}
                
                {/* Extra Tab Button for indentation */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleInsert('  '); // 2 spaces
                    }}
                    className="
                        flex h-9 min-w-[48px] items-center justify-center rounded-lg 
                        border border-[#313244] bg-[#313244]/50 
                        font-mono text-xs font-bold text-gray-400
                        active:scale-95
                    "
                >
                    TAB
                </button>
            </div>

        </div>
    );
}
