import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'docs'
  },
  plugins: [preact()],
})
