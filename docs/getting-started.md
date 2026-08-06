# Getting started

> Install and configure `@manfad/ui` in a Vue 3 + UnoCSS app.

## Requirements

- Vue 3.4+
- UnoCSS 66+
- Inter via `@fontsource/inter` (or an equivalent font load)

## Install

```bash
pnpm add @manfad/ui vue @fontsource/inter
pnpm add -D unocss
```

### Styles and fonts

```ts
import '@manfad/ui/ui.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

### UnoCSS

```ts
import { defineConfig, presetWind3 } from 'unocss'
import { manfadUiContent, presetManfadUi } from '@manfad/ui/preset'

export default defineConfig({
  content: {
    filesystem: manfadUiContent,
  },
  presets: [presetWind3(), ...presetManfadUi()],
})
```

## Package exports

| Export | Purpose |
| --- | --- |
| `@manfad/ui` | Core components, composables, and utilities |
| `@manfad/ui/preset` | UnoCSS preset and content globs |
| `@manfad/ui/ui.css` | Base component styles |
| `@manfad/ui/chart` | Charts DLC |
| `@manfad/ui/time-badge` | TimeBadge DLC |
| `@manfad/ui/md-view` | Markdown viewer DLC |
| `@manfad/ui/excel` | Excel import/export DLC |

## Usage

```vue
<script setup lang="ts">
import { Button } from '@manfad/ui'
</script>

<template>
  <Button>Continue</Button>
</template>
```

## AI assistants

See [LLMs.txt](./getting-started/ai/llms-txt.md) for Cursor / Windsurf / ChatGPT context files.
