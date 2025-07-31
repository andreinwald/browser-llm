import {downloadModel, sendPrompt} from "./useLLM.ts";
import {useEffect, useState} from "react";
import {useTypedSelector} from "./redux/store.ts";

export function App() {
    const {downloadStatus, messageHistory} = useTypedSelector(state => state.llm);
    const [hasWebGPU, setHasWebGPU] = useState(true);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!("gpu" in navigator)) {
            setHasWebGPU(false);
        }
    }, []);

    return (
        <>
            {!hasWebGPU && (
                <div style={{color: 'orange', marginBottom: '10px'}}>
                    Warning: WebGPU is not available. WebLLM will use WASM fallback (much slower).
                </div>
            )}
            <button onClick={() => downloadModel('Llama-3.2-1B-Instruct-q4f16_1-MLC')}>Download model</button>
            <br/>

            {downloadStatus}
            <br/>
            <br/>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
            />
            <button onClick={() => sendPrompt(inputValue)}>Send</button>
            <br/>
            <br/>

            <div>
                {messageHistory.map((message, i) => (
                    <div key={i}>
                        {message.role}:<br/> {message.content}<br/><br/>
                    </div>
                ))}
            </div>
        </>
    )
}
