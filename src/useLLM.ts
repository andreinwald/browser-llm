import {useState} from "react";
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import type {MLCEngine} from "@mlc-ai/web-llm";

export function useLLM() {
    const [messageHistory, setMessageHistory] = useState<ChatCompletionMessageParam[]>([])
    const [status, setStatus] = useState<string>('');
    const [alreadyRun, setAlreadyRun] = useState(false);
    const [model, setModel] = useState<MLCEngine>();

    async function downloadModel() {
        if (alreadyRun) {
            return;
        }
        setAlreadyRun(true);
        setStatus('loading LLM library');
        const {CreateMLCEngine} = await import("@mlc-ai/web-llm");
        setStatus('loading model');
        // List of all models https://mlc.ai/models
        const model = await CreateMLCEngine(
            'Llama-3.2-1B-Instruct-q4f16_1-MLC',
            {initProgressCallback: (p: any) => console.log(p?.text ?? p)}
        );
        setModel(model);
        setStatus('done');
    }

    async function send(message: string) {
        const newUserMessage: ChatCompletionMessageParam = {role: 'user', content: message};
        const updatedHistory = [...messageHistory, newUserMessage];

        setMessageHistory(updatedHistory);

        if (!model) {
            throw new Error("Model not loaded");
        }

        const stream = await model.chat.completions.create({
            messages: updatedHistory,
            stream: true,
            max_tokens: 256,
        });
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
    }

    return {downloadModel, status, send, messageHistory};
}