import {useLLM} from "./useLLM.ts";
import {useEffect, useState} from "preact/hooks";

export function App() {
    const {downloadModel, status, send, messageHistory} = useLLM();
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
            <button onClick={downloadModel}>Download model</button>
            <br/>

            {status}
            <br/>
            <br/>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.currentTarget.value)}
            />
            <button onClick={() => send(inputValue)}>Send</button>
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
