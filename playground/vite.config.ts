import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [
    vue(),
    UnoCSS({
      configFile: fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  build: {
    // Admin PCs run Chrome/Edge 109, no oklch — CSS stays hsl via presetShadcnV3, JS downleveled here.
    target: 'chrome109',
  },
})
