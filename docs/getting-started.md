# Getting started

> Install and configure `@manfad99/ui` in a Vue 3 + UnoCSS app.

## Requirements

- Vue 3.4+
- UnoCSS 66+
- Inter via `@fontsource/inter` (or an equivalent font load)

## Install

```bash
pnpm add @manfad99/ui vue @fontsource/inter
pnpm add -D unocss
```

### Styles and fonts

```ts
import '@manfad99/ui/ui.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

### UnoCSS

```ts
import { defineConfig, presetWind3 } from 'unocss'
import { manfadUiContent, presetManfadUi } from '@manfad99/ui/preset'

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
| `@manfad99/ui` | Core components, composables, and utilities |
| `@manfad99/ui/preset` | UnoCSS preset and content globs |
| `@manfad99/ui/ui.css` | Base component styles |
| `@manfad99/ui/chart` | Charts DLC |
| `@manfad99/ui/time-badge` | TimeBadge DLC |
| `@manfad99/ui/md-view` | Markdown viewer DLC |
| `@manfad99/ui/excel` | Excel import/export DLC |

## Usage

```vue
<script setup lang="ts">
import { Button } from '@manfad99/ui'
</script>

<template>
  <Button>Continue</Button>
</template>
```

## AI assistants

See [LLMs.txt](./getting-started/ai/llms-txt.md) for Cursor / Windsurf / ChatGPT context files.
