import {CreateMLCEngine, type MLCEngineInterface} from "@mlc-ai/web-llm";
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

// List of all models https://mlc.ai/models
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
let enginePromise: Promise<MLCEngineInterface> | null = null;

export function getLLM(progressCallback?: (s: string) => void): Promise<MLCEngineInterface> {
    if (enginePromise) {
        return enginePromise;
    }
    enginePromise = CreateMLCEngine(
        MODEL_ID,
        {initProgressCallback: p => progressCallback && progressCallback(p?.text ?? p)}
    );
    enginePromise.then(() => console.log('loaded'));
    return enginePromise;
}


export async function askQuestion() {
    const llm = await getLLM(console.log);
    console.log('here2');

    const messages: ChatCompletionMessageParam[] = [
        {role: "user", content: "Why sky is blue?"},
    ]

    const reply = await llm.chat.completions.create({
        messages,
    });
    console.log(reply.choices[0].message);
    console.log(reply.usage);

}
askQuestion();