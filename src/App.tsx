import {useState, useEffect} from "react";
import type {ChatCompletionMessageParam, MLCEngineInterface} from "@mlc-ai/web-llm";

export function App() {
    const [status, setStatus] = useState<string | null>('loading LLM library');

    useEffect(() => {
        (async () => {
            const llm = await loadLLM();
            setStatus('running first prompt')
            const messages: ChatCompletionMessageParam[] = [
                {role: "user", content: "Why sky is blue?"},
            ]

            const reply = await llm.chat.completions.create({
                messages,
            });
            setStatus('done')
            console.log(reply.choices[0].message);
        })();
    }, []);

    return (
        <>{status}</>
    )
}

// if (!("gpu" in navigator)) {
//     console.warn("WebGPU not available; WebLLM will try WASM fallback (much slower).");
// }

async function loadLLM(): Promise<MLCEngineInterface> {
    return (await import('./LLM.ts')).default;
}

