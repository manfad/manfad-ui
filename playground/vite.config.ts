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
