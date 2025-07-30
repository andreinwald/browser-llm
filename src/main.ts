import {render} from 'preact'
import {App} from '././App.tsx'

if (!("gpu" in navigator)) {
    console.warn("WebGPU not available; WebLLM will try WASM fallback (much slower).");
}

render(App(), document.getElementById('app')!)
setTimeout(() => {
    import('./LLM.ts');
}, 100);
