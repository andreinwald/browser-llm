import {createSlice} from '@reduxjs/toolkit'
import type {ChatCompletionMessageParam} from "@mlc-ai/web-llm/lib/openai_api_protocols/chat_completion";

type State = {
    messageHistory: ChatCompletionMessageParam[],
    downloadStatus: string,
}

const initialState: State = {
    messageHistory: [],
    downloadStatus: '',
}

export const llmSlice = createSlice({
    name: 'llm',
    initialState,
    reducers: {
        setMessageHistory: (
            state,
            {payload}: { payload: ChatCompletionMessageParam[] }
        ) => {
            state.messageHistory = payload;
        },
        setDownloadStatus: (
            state,
            {payload}: { payload: string }
        ) => {
            state.downloadStatus = payload;
        },
    },
})

export const {setMessageHistory, setDownloadStatus} = llmSlice.actions;
export const llmReducer = llmSlice.reducer;