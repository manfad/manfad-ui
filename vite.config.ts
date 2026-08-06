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
        chart: fileURLToPath(new URL('./src/chart.ts', import.meta.url)),
        'time-badge': fileURLToPath(new URL('./src/time-badge.ts', import.meta.url)),
        'md-view': fileURLToPath(new URL('./src/md-view.ts', import.meta.url)),
        excel: fileURLToPath(new URL('./src/excel.ts', import.meta.url)),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.mjs`,
    },
    rollupOptions: {
      // Everything stays external; consumers install these via this package's
      // dependencies / optional peers. Keeping class strings in readable ESM
      // output also lets the consumer's UnoCSS extract utility classes from
      // dist (see preset.ts).
      external: [
        'vue',
        'radix-vue',
        '@unovis/ts',
        '@unovis/vue',
        // The chart components reach Unovis through deep paths
        // (`@unovis/vue/components/line`) so consumers only pull in the
        // visualizations they render, not the map/graph surface.
        /^@unovis\/(ts|vue)\//,
        'clsx',
        'tailwind-merge',
        'class-variance-authority',
        'markdown-it',
        '@vueuse/core',
        'xlsx',
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
