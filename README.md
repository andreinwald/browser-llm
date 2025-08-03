# Browser LLM Demo Working with JavaScript and WebGPU

WebGPU is already supported in Chrome, Safari, Firefox, iOS (v26), and Android ([check](https://webgpureport.org))

**Demo, similar to ChatGPT:** https://andreinwald.github.io/browser-llm/

![Screenshot](./screenshot.png)

HackerNews discussion: https://news.ycombinator.com/item?id=44767775

- No need to use your OPENAI_API_KEY - it's a local model that runs on your device
- No network requests to any API
- No need to install any program
- No need to download files to your device (model is cached in browser via [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage))
- Site will ask before downloading large files (LLM model) to browser cache
- Hosted on GitHub Pages from this repo - secure, because you can see what you're running
- Default model: Llama-3.2-1B

## WebGPU Browser and OS Compatibility
<picture>
  <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webgpu.webp">
  <source type="image/png" srcset="https://caniuse.bitsofco.de/image/webgpu.png">
  <img src="https://caniuse.bitsofco.de/image/webgpu.jpg" alt="Data on support for the webgpu feature across the major browsers from caniuse.com">
</picture>