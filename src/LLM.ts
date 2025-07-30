import {CreateMLCEngine, type MLCEngineInterface} from "@mlc-ai/web-llm";

// List of all models https://mlc.ai/models
const MODEL_ID = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
let enginePromise: Promise<MLCEngineInterface> | null = null;

function getLLM(progressCallback?: (s: string) => void): Promise<MLCEngineInterface> {
    enginePromise = CreateMLCEngine(
        MODEL_ID,
        {initProgressCallback: p => progressCallback && progressCallback(p?.text ?? p)}
    );
    enginePromise.then(() => console.log('loaded'));
    return enginePromise;
}

export default getLLM();