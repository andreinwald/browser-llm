import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import type {MLCEngine} from "@mlc-ai/web-llm";
import {setDownloadStatus, setMessageHistory} from "./redux/llmSlice.ts";
import {dispatch, getState} from "./redux/store.ts";

let libraryCache: any = null;

async function getLibrary() {
    if (libraryCache) {
        return libraryCache;
    }
    const {CreateMLCEngine} = await import("@mlc-ai/web-llm");
    return {CreateMLCEngine};
}

let model: MLCEngine;

export async function downloadModel(name: string) {
    dispatch(setDownloadStatus('loading LLM library'));
    const {CreateMLCEngine} = await getLibrary();
    dispatch(setDownloadStatus('loading model'));
    // List of all models https://mlc.ai/models
    model = await CreateMLCEngine(
        name,
        {initProgressCallback: (p: any) => console.log(p?.text ?? p)}
    );
    dispatch(setDownloadStatus('done'));
}

export async function sendPrompt(message: string, maxTokens = 256) {
    const messagesHistory = getState(state => state.llm.messageHistory);
    const newUserMessage: ChatCompletionMessageParam = {role: 'user', content: message};
    let updatedHistory = [...messagesHistory, newUserMessage];
    dispatch(setMessageHistory(updatedHistory));

    if (!model) {
        throw new Error("Model not loaded");
    }

    const stream = await model.chat.completions.create({
        messages: updatedHistory,
        stream: true,
        max_tokens: maxTokens,
    });
    const response: ChatCompletionMessageParam = {
        role: "assistant",
        content: ""
    };
    updatedHistory = [...updatedHistory, response];
    dispatch(setMessageHistory(updatedHistory));

    for await (const chunk of stream) {
        const delta = chunk?.choices?.[0]?.delta?.content ?? "";
        if (delta) {
            const current = getState(state => state.llm.messageHistory);
            const updated = [...current];
            const lastIndex = updated.length - 1;
            updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + delta
            };
            dispatch(setMessageHistory(updated));
        }
    }
}