import { useState, useCallback, useRef } from 'react';
import { AI_CASCADE, BUILDER_SYSTEM_PROMPT } from '@/lib/ai-cascade-config';
import useProjectStore from '@/store/useProjectStore'; // We will create this next

/**
 * 🏗️ HOOK: useAIBuilder
 * Orchestrates the multi-key, sequential generation of the project.
 */
export default function useAIBuilder() {
    // --- LOCAL STATE ---
    const [isBuilding, setIsBuilding] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0, filename: '' });
    const [logs, setLogs] = useState([]);
    const [activeKeyId, setActiveKeyId] = useState(AI_CASCADE[0].id);

    // --- REFS (For mutable state without re-renders) ---
    const keyIndexRef = useRef(0);
    const abortControllerRef = useRef(null);

    // --- GLOBAL STORE ACCESS ---
    const { updateFileContent, project } = useProjectStore();

    // --- LOGGING HELPER ---
    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    /**
     * 🚀 CORE: CALL PENTAGON API
     * Tries to generate code using the current key.
     * If it fails (429/500), it recurses to the next key in the cascade.
     */
    const generateCode = async (fileNode, blueprintContext, retryCount = 0) => {
        if (keyIndexRef.current >= AI_CASCADE.length) {
            throw new Error("CRITICAL: All 5 Pentagon Keys Exhausted. System Halted.");
        }

        const config = AI_CASCADE[keyIndexRef.current];
        setActiveKeyId(config.id);

        try {
            // 1. Prepare Prompt (Context Injection)
            const userPrompt = `
            CONTEXT:
            - Project Name: ${project?.name || 'App'}
            - File Path: ${fileNode.path} (This is the ONLY file you write now)
            - Master Blueprint: ${blueprintContext.substring(0, 1000)}... (truncated for efficiency)
            
            TASK:
            Write the complete, production-ready code for '${fileNode.name}'. 
            Do not use markdown blocks. Just raw code.
            `;

            // 2. API Request
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.key}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
                    system_instruction: { parts: [{ text: BUILDER_SYSTEM_PROMPT }] }
                }),
                signal: abortControllerRef.current.signal
            });

            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`Rate Limit / Server Error (${response.status})`);
                }
                throw new Error(`API Error ${response.status}`);
            }

            const data = await response.json();
            const rawCode = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!rawCode) throw new Error("Empty response from AI");

            // 3. Clean & Validate Code
            let cleanCode = rawCode.replace(/```\w*\n/g, '').replace(/```/g, '').trim();
            return cleanCode;

        } catch (error) {
            addLog(`⚠️ ${config.id} Failed: ${error.message}. Switching...`, 'warning');
            
            // 🔄 SWITCH KEY & RETRY
            keyIndexRef.current += 1;
            return generateCode(fileNode, blueprintContext, retryCount + 1);
        }
    };

    /**
     * 🏁 START BUILD PROCESS
     * Iterates through the file queue sequentially.
     */
    const startBuild = useCallback(async (fileQueue, blueprintContext) => {
        if (!fileQueue || fileQueue.length === 0) return;

        setIsBuilding(true);
        keyIndexRef.current = 0; // Reset to Primary Key
        abortControllerRef.current = new AbortController();
        setLogs([]);

        addLog(`🚀 Starting Build: ${fileQueue.length} files queued.`);

        for (let i = 0; i < fileQueue.length; i++) {
            const fileNode = fileQueue[i];
            
            setProgress({ 
                current: i + 1, 
                total: fileQueue.length, 
                filename: fileNode.name 
            });

            try {
                addLog(`🔨 Building: ${fileNode.name} using ${AI_CASCADE[keyIndexRef.current].id}...`);
                
                const code = await generateCode(fileNode, blueprintContext);
                
                // Save to AuraFS (via Store)
                await updateFileContent(fileNode.id, code);
                
                addLog(`✅ Saved: ${fileNode.name}`, 'success');

                // Artificial delay to prevent instant 429s (Politeness Policy)
                await new Promise(r => setTimeout(r, 500)); 

            } catch (err) {
                addLog(`❌ Build Failed at ${fileNode.name}: ${err.message}`, 'error');
                break; // Stop loop on critical failure
            }
        }

        setIsBuilding(false);
        addLog(`✨ Build Sequence Complete!`, 'success');
    }, [updateFileContent, project]);

    const stopBuild = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsBuilding(false);
            addLog("🛑 Build Aborted by User.", 'warning');
        }
    }, []);

    return {
        isBuilding,
        progress,
        logs,
        activeKeyId,
        startBuild,
        stopBuild
    };
}
