# Browser LLM demo working on JavaScript and WebGPU

WebGPU is already supported in Chrome, Safari, Firefox, iOS (v26) and Android ([check](https://webgpureport.org))

**Demo**: https://andreinwald.github.io/browser-llm/

![Screenshot](./screenshot.png)

Discussion about this project on HackerNews: https://news.ycombinator.com/item?id=44767775

- No need to use your OPENAI_API_KEY - this is a local model that runs on your device.
- No network requests to any API.
- No need to install any program, you can use it as a website.
- Site will ask before downloading the llm model to browser cache.
- Default model: Llama-3.2-1B

## WebGPU browser and OS compatibility
<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>
