import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

type State = {
    messageHistory: ChatCompletionMessageParam[],
    criticalError: string | false,
    downloadStatus: string,
    isGenerating: boolean,
}

const initialState: State = {
    messageHistory: [],
    criticalError: false,
    downloadStatus: 'waiting',
    isGenerating: false,
}

export const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {
        addUserMessage: (state, action: PayloadAction<ChatCompletionMessageParam>) => {
            state.messageHistory.push(action.payload);
        },
        addBotMessage: (state, action: PayloadAction<ChatCompletionMessageParam>) => {
            state.messageHistory.push(action.payload);
        },
        updateLastBotMessageContent: (state, action: PayloadAction<string>) => {
            const lastMessage = state.messageHistory[state.messageHistory.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content += action.payload;
            }
        },
        setDownloadStatus: (
            state,
            {payload}: { payload: string }
        ) => {
            state.downloadStatus = payload;
        },
        setCriticalError: (
            state,
            {payload}: { payload: string }
        ) => {
            state.criticalError = payload;
        },
        setIsGenerating: (state, action: PayloadAction<boolean>) => {
            state.isGenerating = action.payload;
        }
    },
})

export const {
    addUserMessage,
    addBotMessage,
    updateLastBotMessageContent,
    setDownloadStatus,
    setCriticalError,
    setIsGenerating
} = llmSlice.actions;
export const llmReducer = llmSlice.reducer;