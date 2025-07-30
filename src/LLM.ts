import type {MLCEngineInterface} from "@mlc-ai/web-llm";
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

let createFunction: any = null;

export async function loadLibrary() {
    const {CreateMLCEngine} = await import("@mlc-ai/web-llm");
    createFunction = CreateMLCEngine;
}

let model: MLCEngineInterface | null = null;

export async function loadModel(modelId: string, progressCallback?: (s: string) => void) {
    if (!createFunction) {
        throw new Error("Library not loaded");
    }
    model = await createFunction(
        modelId,
        {initProgressCallback: (p: any) => progressCallback && progressCallback(p?.text ?? p)}
    );
}

export async function chat(messagesHistory: ChatCompletionMessageParam[]) {
    if (!model) {
        throw new Error("Model not loaded");
    }

    return model.chat.completions.create({
        messages: messagesHistory,
        stream: true,
        max_tokens: 256,
    });

}