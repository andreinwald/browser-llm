import {listModels} from "@huggingface/hub";

export async function getCompatibleModels() {
    const models = [];
    for await (const model of listModels({
        search: {
            tags: ['gguf'],
        }
    })) {
        models.push(model);
    }
    return models;
}
