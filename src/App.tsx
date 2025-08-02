import {downloadModel, sendPrompt} from "./LLM.ts";
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

    function submitPrompt(e: { preventDefault: () => void; }) {
        e.preventDefault();
        sendPrompt(inputValue);
        setInputValue('');
    }

    return (
        <div style={{maxWidth: '1000px', margin: 'auto', padding: '20px'}}>
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
            <br/>
            <br/>

            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {messageHistory.map((message, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                        padding: '10px',
                        borderRadius: '8px'
                    }}>
                        <div style={{fontSize: '0.8em', color: '#666'}}>{message.role}:</div>
                        <div>{message.content}</div>
                    </div>
                ))}
            </div>
            <form onSubmit={submitPrompt}>
                
                <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.currentTarget.value)}
                />
                <button type='submit'>Send</button>
            </form>
        </div>
    )
}
