import { fileURLToPath, URL } from 'node:url'
import { defineConfig, presetWind3 } from 'unocss'
import { presetYfUi } from '../src/preset'

// Globs must be absolute: relative filesystem globs resolve against the
// process cwd, so running `pnpm dev` from the repo root silently matched
// nothing and library classes (button variants, icons) went missing in dev.
const libSrc = fileURLToPath(new URL('../src', import.meta.url))
const playgroundSrc = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  presets: [presetWind3(), ...presetYfUi({ color: 'zinc', radius: 0.5 })],
  content: {
    pipeline: { include: [/\.(vue|[jt]sx?)($|\?)/] },
    filesystem: [`${libSrc}/**/*.{vue,ts}`, `${playgroundSrc}/**/*.{vue,ts}`],
  },
})
