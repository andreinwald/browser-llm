import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";
import type {MLCEngine} from "@mlc-ai/web-llm";
import {
    setDownloadStatus,
    setCriticalError,
    addUserMessage,
    addBotMessage,
    updateLastBotMessageContent,
    setIsGenerating
} from "./redux/llmSlice.ts";
import {dispatch, getState} from "./redux/store.ts";
import {DOWNLOADED_MODELS_KEY} from "./constants.ts";

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

    try {
        dispatch(setDownloadStatus('loading LLM library'));
        const {CreateMLCEngine} = await getLibrary();
        dispatch(setDownloadStatus('loading model ' + name));
        // List of all models https://mlc.ai/models
        model = await CreateMLCEngine(
            name,
            {
                initProgressCallback: (p: any) => {
                    if (p?.text) {
                        dispatch(setDownloadStatus(p.text));
                    }
                }
            }
        );
    } catch (error: any) {
        if (error.message) {
            dispatch(setCriticalError(error.message));
        } else {
            dispatch(setCriticalError(JSON.stringify(error)));
        }
        dispatch(setDownloadStatus('Error. Please check that WebGPU is enabled https://webgpureport.org'));
        console.error(error);
        return;
    }

    dispatch(setDownloadStatus('done'));
    localStorage.setItem(DOWNLOADED_MODELS_KEY, JSON.stringify([name]));
}

export async function sendPrompt(message: string, maxTokens = 1000) {
    if (!model) {
        throw new Error("Model not loaded");
    }

    dispatch(setIsGenerating(true));

    const newUserMessage: ChatCompletionMessageParam = {role: 'user', content: message};
    dispatch(addUserMessage(newUserMessage));

    const messagesHistory = getState().llm.messageHistory;

    try {
        const stream = await model.chat.completions.create({
            messages: messagesHistory,
            stream: true,
            max_tokens: maxTokens,
        });

        const botMessage: ChatCompletionMessageParam = {
            role: "assistant",
            content: ""
        };
        dispatch(addBotMessage(botMessage));

        for await (const chunk of stream) {
            const delta = chunk?.choices?.[0]?.delta?.content ?? "";
            if (delta) {
                dispatch(updateLastBotMessageContent(delta));
            }
        }
    } catch (e) {
        console.error(e)
    } finally {
        dispatch(setIsGenerating(false));
    }
}

export function interrupt() {
    if (model) {
        model.interrupt();
    }
}
