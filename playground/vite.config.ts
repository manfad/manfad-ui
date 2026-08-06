import { fileURLToPath, URL } from 'node:url'
import { basename, resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

const playgroundRoot = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const allowedRoots = [searchForWorkspaceRoot(projectRoot)]

// T3 opens branches in sibling worktrees while the preview server may still be
// rooted at the canonical checkout. Allow this repository's worktree parent so
// Vite can serve the active branch without hard-coding an ephemeral worktree ID.
if (process.env.T3CODE_HOME)
  allowedRoots.push(resolve(process.env.T3CODE_HOME, 'worktrees', basename(projectRoot)))

export default defineConfig({
  root: playgroundRoot,
  // GitHub Pages project site: https://manfad.github.io/manfad-ui/
  base: process.env.GITHUB_ACTIONS ? '/manfad-ui/' : '/',
  plugins: [
    vue(),
    UnoCSS({
      configFile: fileURLToPath(new URL('./uno.config.ts', import.meta.url)),
    }),
  ],
  resolve: {
    // Keep a single Vue copy so radix-vue slots don't hit
    // `Cannot read properties of null (reading 'ce')`.
    dedupe: ['vue'],
    alias: {
      '@': fileURLToPath(new URL('../src', import.meta.url)),
      // Playground demos import the public package name; resolve to source so
      // CI does not need a prior library build / published dist.
      '@manfad99/ui/chart': fileURLToPath(new URL('../src/chart.ts', import.meta.url)),
      '@manfad99/ui/excel': fileURLToPath(new URL('../src/excel.ts', import.meta.url)),
      '@manfad99/ui/md-view': fileURLToPath(new URL('../src/md-view.ts', import.meta.url)),
      '@manfad99/ui/time-badge': fileURLToPath(new URL('../src/time-badge.ts', import.meta.url)),
      '@manfad99/ui/preset': fileURLToPath(new URL('../src/preset.ts', import.meta.url)),
      '@manfad99/ui': fileURLToPath(new URL('../src/index.ts', import.meta.url)),
      vue: fileURLToPath(new URL('../node_modules/vue', import.meta.url)),
    },
  },
  server: {
    fs: {
      allow: allowedRoots,
    },
  },
  preview: {
    // SPA fallback for vue-router history mode
  },
  build: {
    // Admin PCs run Chrome/Edge 109, no oklch — CSS stays hsl via presetShadcnV3, JS downleveled here.
    target: 'chrome109',
  },
  appType: 'spa',
})
