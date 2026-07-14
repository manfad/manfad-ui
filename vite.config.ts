import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// Library build. The playground app has its own config in playground/vite.config.ts.
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: './tsconfig.json',
      include: ['src'],
      rollupTypes: false,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        preset: fileURLToPath(new URL('./src/preset.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      // Everything stays external; consumers install these via this package's
      // dependencies. Keeping class strings in readable ESM output also lets
      // the consumer's UnoCSS extract utility classes from dist (see preset.ts).
      external: [
        'vue',
        'radix-vue',
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'unocss',
        'unocss-preset-animations',
        'unocss-preset-shadcn/v3',
      ],
    },
    // Old admin PCs run Chrome/Edge 109 (no oklch). JS-wise this library is
    // plain ES2020; the consumer app's build target does the final downleveling.
    target: 'es2020',
    minify: false,
  },
})
