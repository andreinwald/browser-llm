import {isWebGPUok} from './CheckWebGPU.ts';
import {describe, test, expect, vi} from 'vitest';

describe('isWebGPUok', () => {
    test('should return an error message if WebGPU is not supported', async () => {
        // In jsdom, navigator.gpu is undefined, so this should fail.
        const result = await isWebGPUok();
        expect(result).toBe('WebGPU is NOT supported on this browser.');
    });

    test('should return an error message if adapter is not found', async () => {
        // Mock navigator.gpu but make requestAdapter return null
        vi.stubGlobal('navigator', {
            gpu: {
                requestAdapter: async () => null,
            },
        });

        const result = await isWebGPUok();
        expect(result).toBe('WebGPU Adapter not found.');
    });

    test('should return true if WebGPU is supported and working', async () => {
        // A more complete mock of the WebGPU API
        const mockDevice = {
            createShaderModule: vi.fn(() => ({
                getCompilationInfo: vi.fn().mockResolvedValue({
                    messages: [],
                }),
            })),
        };

        const mockAdapter = {
            requestDevice: async () => mockDevice,
            features: new Set(['shader-f16']),
        };

        vi.stubGlobal('navigator', {
            gpu: {
                requestAdapter: async () => mockAdapter,
            },
        });

        const result = await isWebGPUok();
        expect(result).toBe(true);
    });
});
