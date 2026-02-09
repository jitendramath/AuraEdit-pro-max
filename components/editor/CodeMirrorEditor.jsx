import { useEffect, useRef } from 'react';

// ⚠️ Note: In a real Next.js app, you need to install these:
// npm install codemirror
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';

// Modes (Syntax Highlighting)
// In Next.js, we import these conditionally or globally. 
// For this snippet, we assume standard Webpack loading works or use dynamic imports if needed.
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/css/css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';

/**
 * 💻 CODE MIRROR EDITOR (v3.0)
 * Wraps the raw CodeMirror library into a React component.
 * Handles bi-directional syncing: User Typing <-> AI Writing.
 */
export default function CodeMirrorEditor({ fileId, fileName, initialContent, onChange }) {
    const editorRef = useRef(null);      // DOM Element Ref
    const cmInstance = useRef(null);     // CodeMirror Instance
    const isUpdating = useRef(false);    // Lock to prevent loops

    // --- 1. INITIALIZE EDITOR ---
    useEffect(() => {
        if (!editorRef.current) return;

        // Dynamic import for CodeMirror to be safe with SSR (optional but good practice)
        const CodeMirror = require('codemirror');

        cmInstance.current = CodeMirror.fromTextArea(editorRef.current, {
            mode: "javascript", // Default, updates dynamically
            theme: "dracula",
            lineNumbers: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            tabSize: 2,
            indentUnit: 2,
            lineWrapping: false, // Professional IDEs usually don't wrap code
            viewportMargin: Infinity,
        });

        // Event Listener: User Typing
        cmInstance.current.on('change', (instance, changeObj) => {
            if (changeObj.origin === 'setValue') return; // Ignore programmatic changes (AI)
            const val = instance.getValue();
            onChange(val); // Update Zustand Store
        });

        // Cleanup
        return () => {
            if (cmInstance.current) {
                cmInstance.current.toTextArea();
            }
        };
    }, []); // Run once on mount

    // --- 2. HANDLE FILE SWITCHING & AI UPDATES ---
    useEffect(() => {
        if (!cmInstance.current) return;

        const currentVal = cmInstance.current.getValue();
        
        // Only update if content is different (prevents cursor jumping)
        if (initialContent !== currentVal) {
            const cursor = cmInstance.current.getCursor(); // Save cursor position
            cmInstance.current.setValue(initialContent || '');
            
            // If user was typing, restore cursor (approximate)
            // If AI replaced everything, this might reset, which is expected behavior
            cmInstance.current.setCursor(cursor);
        }

        // --- DYNAMIC MODE SWITCHING ---
        const ext = fileName.split('.').pop();
        let mode = 'javascript';
        if (ext === 'html') mode = 'xml';
        if (ext === 'css') mode = 'css';
        if (ext === 'jsx') mode = 'jsx';
        if (ext === 'json') mode = { name: "javascript", json: true };

        cmInstance.current.setOption('mode', mode);

    }, [fileId, initialContent, fileName]); // Re-run when file or content changes

    return (
        <div className="h-full w-full text-base">
            <style jsx global>{`
                .CodeMirror {
                    height: 100% !important;
                    font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
                    font-size: 14px;
                    background-color: #1e1e2e !important;
                }
                .CodeMirror-gutters {
                    background-color: #1e1e2e !important;
                    border-right: 1px solid #313244 !important;
                }
                .CodeMirror-linenumber {
                    color: #585b70 !important;
                }
                /* Custom Scrollbar for the Editor */
                .CodeMirror-scroll::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                .CodeMirror-scroll::-webkit-scrollbar-track {
                    background: #1e1e2e;
                }
                .CodeMirror-scroll::-webkit-scrollbar-thumb {
                    background: #313244;
                    border-radius: 5px;
                }
                .CodeMirror-scroll::-webkit-scrollbar-thumb:hover {
                    background: #45475a;
                }
            `}</style>
            
            <textarea ref={editorRef} defaultValue={initialContent} />
        </div>
    );
}
