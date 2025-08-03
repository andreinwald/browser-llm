export async function isWebGPUok(): Promise<true | string> {
    if (!("gpu" in navigator)) {
        return 'WebGPU is NOT supported on this browser.';
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        return 'WebGPU Adapter not found.';
    }

    const device = await adapter.requestDevice();
    if (!device) {
        return 'WebGPU Device not available.';
    }

    // Minimal Compute Shader WGSL code for test
    const shaderCode = `
    @compute @workgroup_size(1)
    fn main() {
      // simple no-op compute shader
    }
  `;

    try {
        const shaderModule = device.createShaderModule({code: shaderCode});
        const info = await shaderModule.getCompilationInfo();
        if (info.messages.some(msg => msg.type === 'error')) {
            return 'ShaderModule compilation errors:' + JSON.stringify(info.messages);
        }

        console.log('ShaderModule compiled successfully. WebGPU is working.');
        return true;
    } catch (err) {
        return 'ShaderModule creation failed:' + JSON.stringify(err);
    }
}
