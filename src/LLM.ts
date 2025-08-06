import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion'
import type { MLCEngine, InitProgressReport, MLCEngineConfig } from '@mlc-ai/web-llm'

let libraryCache: ((name: string, options?: MLCEngineConfig) => Promise<MLCEngine>) | null = null;

async function getLibrary() {
  if (libraryCache) {
    return libraryCache
  }
  const { CreateMLCEngine } = await import('@mlc-ai/web-llm')
  libraryCache = CreateMLCEngine
  return libraryCache
}

export async function downloadModel(
  name: string,
  progressCallback: (report: InitProgressReport) => void
): Promise<MLCEngine> {
    const CreateMLCEngine = await getLibrary();
    if (!CreateMLCEngine) {
        throw new Error("Could not load MLCEngine");
    }
  const model = await CreateMLCEngine(name, {
    initProgressCallback: progressCallback,
  })
  localStorage.setItem('downloaded_models', JSON.stringify([name]))
  return model
}

export async function* sendPrompt(
  model: MLCEngine,
  messages: ChatCompletionMessageParam[],
  message: string,
  maxTokens = 1000
) {
  if (!model) {
    throw new Error('Model not loaded')
  }

  const newUserMessage: ChatCompletionMessageParam = {
    role: 'user',
    content: message,
  }
  const history = [...messages, newUserMessage]
  yield { history }

  const stream = await model.chat.completions.create({
    messages: history,
    stream: true,
    max_tokens: maxTokens,
  })

  const response: ChatCompletionMessageParam = {
    role: 'assistant',
    content: '',
  }
  const finalHistory = [...history, response]
  yield { history: finalHistory }

  for await (const chunk of stream) {
    const delta = chunk?.choices?.[0]?.delta?.content ?? ''
    if (delta) {
      yield { delta }
    }
  }
}
