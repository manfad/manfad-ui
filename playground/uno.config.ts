import { fileURLToPath, URL } from 'node:url'
import { defineConfig, presetWind3 } from 'unocss'
import { presetManfadUi } from '../src/preset'

// Globs must be absolute: relative filesystem globs resolve against the
// process cwd, so running `pnpm dev` from the repo root silently matched
// nothing and library classes (button variants, icons) went missing in dev.
const libSrc = fileURLToPath(new URL('../src', import.meta.url))
const playgroundSrc = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  presets: [presetWind3(), ...presetManfadUi({ color: 'blue', radius: 0.5 })],
  content: {
    // The `include` here widens UnoCSS's default to plain .ts/.js so library
    // sources are scanned. That also drags in dependencies, and Unovis embeds
    // raw CSS in template literals which UnoCSS turns into unparseable rules —
    // hence the exclude. Library classes still arrive via `filesystem` above.
    pipeline: {
      include: [/\.(vue|[jt]sx?)($|\?)/],
      exclude: [/[\\/]node_modules[\\/]/],
    },
    filesystem: [`${libSrc}/**/*.{vue,ts}`, `${playgroundSrc}/**/*.{vue,ts}`],
  },
})
