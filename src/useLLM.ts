import {useCallback, useState} from "react";
import {chat, loadLibrary, loadModel} from "./LLM.ts";
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

export function useLLM() {
    const [messageHistory, setMessageHistory] = useState<ChatCompletionMessageParam[]>([])
    const [status, setStatus] = useState<string>('');
    const [alreadyRun, setAlreadyRun] = useState(false);

    const start = useCallback(async () => {
        if (alreadyRun) {
            return;
        }
        setAlreadyRun(true);
        setStatus('loading LLM library');
        await loadLibrary();
        setStatus('loading model');
        // List of all models https://mlc.ai/models
        await loadModel('Llama-3.2-1B-Instruct-q4f16_1-MLC', console.log);
        setStatus('done');
    }, []);

    const send = useCallback(async (message: string) => {
        const newUserMessage: ChatCompletionMessageParam = {role: 'user', content: message};
        const updatedHistory = [...messageHistory, newUserMessage];
        
        setMessageHistory(updatedHistory);
        
        const stream = await chat(updatedHistory);
        const assistantMessage: ChatCompletionMessageParam = {
            role: "assistant",
            content: ""
        };
        // Add the assistant message to history
        setMessageHistory(prev => [...prev, assistantMessage]);
        
        for await (const chunk of stream) {
            const delta = chunk?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
                setMessageHistory(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: updated[lastIndex].content + delta
                    };
                    return updated;
                });
            }
        }
    }, [messageHistory]);

    return {start, status, send, messageHistory};
}