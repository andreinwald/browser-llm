import { configureStore } from '@reduxjs/toolkit'
import { llmReducer } from './llmSlice.ts'
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from 'react-redux'

export const store = configureStore({
  reducer: {
    llm: llmReducer,
  },
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export const useTypedDispatch = () => useDispatch<AppDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
export const dispatch = store.dispatch
export const getState = <T>(selector: (state: RootState) => T): T => {
  return selector(store.getState())
}
