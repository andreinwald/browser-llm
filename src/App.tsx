import {useState, useEffect} from "react";
import {chat, loadLibrary, loadModel} from "./LLM.ts";
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

export function App() {
    const [status, setStatus] = useState<string | null>('loading LLM library');
    const [response, setResponse] = useState<string>('');

    useEffect(() => {
        (async () => {
            await loadLibrary();
            setStatus('loading model');
            // List of all models https://mlc.ai/models
            await loadModel('Llama-3.2-1B-Instruct-q4f16_1-MLC', console.log);
            setStatus('done');
            const messages: ChatCompletionMessageParam[] = [
                {role: "user", content: "Why sky is blue?"},
            ]
            const stream = await chat(messages);
            let full = '';
            for await (const chunk of stream) {
                const delta = chunk?.choices?.[0]?.delta?.content ?? "";
                if (delta) {
                    full += delta;
                    setResponse(full);
                }
            }
        })();
    }, []);

    return (
        <>{status}
            <br/>
            <br/>
            {response}
        </>
    )
}

// if (!("gpu" in navigator)) {
//     console.warn("WebGPU not available; WebLLM will try WASM fallback (much slower).");
// }
