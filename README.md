# @manfad99/ui

A Vue 3 component library for admin products — accessible primitives, form controls, tables, and charts, styled with UnoCSS and designed to run on Chrome 109+ (HSL tokens, no `oklch`).

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

In your app entry:

```ts
import '@manfad99/ui/ui.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

### UnoCSS

Register the library preset and scan published component files for utilities:

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

Optional preset options:

```ts
presets: [presetWind3(), ...presetManfadUi({ color: 'blue', radius: 0.5 })]
```

### Usage

```vue
<script setup lang="ts">
import { Button } from '@manfad99/ui'
</script>

<template>
  <Button>Continue</Button>
</template>
```

## Package exports

| Export | Purpose |
| --- | --- |
| `@manfad99/ui` | Core components, composables, and utilities |
| `@manfad99/ui/preset` | UnoCSS preset and content globs |
| `@manfad99/ui/ui.css` | Base component styles |
| `@manfad99/ui/chart` | Charts DLC (optional peer: `@unovis/*`) |
| `@manfad99/ui/time-badge` | TimeBadge DLC (optional peer: `@vueuse/core`) |
| `@manfad99/ui/md-view` | Markdown viewer DLC (optional peer: `markdown-it`) |
| `@manfad99/ui/excel` | Excel import/export DLC (optional peer: `xlsx`) |

## Optional DLCs

Heavy surfaces ship as **subpath add-ons**. Import them from their export and install the peer only when you use that surface — the core `@manfad99/ui` barrel does not pull these libraries in.

| DLC | Import | Install |
| --- | --- | --- |
| Charts | `@manfad99/ui/chart` | `pnpm add @unovis/ts@1.6.7 @unovis/vue@1.6.7` |
| TimeBadge | `@manfad99/ui/time-badge` | `pnpm add @vueuse/core` |
| MdView | `@manfad99/ui/md-view` | `pnpm add markdown-it` |
| Excel | `@manfad99/ui/excel` | `pnpm add xlsx` |

```ts
import { LineChart } from '@manfad99/ui/chart'
import { TimeBadge } from '@manfad99/ui/time-badge'
import { MdView } from '@manfad99/ui/md-view'
import { Excel, ExcelExport, ExcelImport } from '@manfad99/ui/excel'
```

## Development

```bash
pnpm install
pnpm dev         # component playground
pnpm build       # library → dist/
pnpm typecheck
pnpm test
```

The playground homepage is **Home** (`/docs`, README via `MdView`; `/` redirects there). Use the header **ModeToggle** (or `D`) to switch to the component playground or Extra DLCs. Each component has its own route and a Usage example.

### Workspace consumers

From a pnpm workspace root:

```json
"@manfad99/ui": "workspace:*"
```

```bash
pnpm install
pnpm --filter @manfad99/ui build
```

## Theming

Blue is the default palette. Presets expose coordinated roles for primary, secondary, tertiary, rival, surfaces, forms, and the sidebar in light and dark mode.

**Rival** is the opposing accent — the hue that stands apart from the primary (for example red against blue). Use it sparingly for emphasis.

Override tokens with HSL channels (no wrapping `hsl()`), so opacity modifiers keep working:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --rival: 0 72% 45%;
  --rival-foreground: 0 0% 98%;
}
```

`ThemeSwitcher` persists component and background palette choices on `document.documentElement` as `data-manfad-component-theme` and `data-manfad-background-theme`. Available palettes: Neutral, Blue, Green, Orange, Rose, Violet. White is background-only.

`ThemePalette` renders live token swatches from CSS variables (no hardcoded colors in script):

```vue
<script setup lang="ts">
import { ThemePalette, ThemeSwitcher } from '@manfad99/ui'
</script>

<template>
  <ThemeSwitcher />
  <ThemePalette />
  <ThemePalette :tokens="['primary', 'rival', 'muted']" />
</template>
```

UnoCSS colour utilities follow the same roles (`bg-primary`, `bg-rival`, `text-rival-foreground`, …). `Button` and `Badge` accept `variant="tertiary"` and `variant="rival"`.

## Charts (DLC)

`LineChart`, `AreaChart`, `BarChart`, and `DonutChart` wrap [Unovis](https://unovis.dev). Keep `@unovis/vue` and `@unovis/ts` on matching exact versions.

```bash
pnpm add @unovis/ts@1.6.7 @unovis/vue@1.6.7
```

```vue
<script setup lang="ts">
import { LineChart } from '@manfad99/ui/chart'

const data = [{ month: new Date(2025, 0, 1), kuching: 18420, miri: 12980 }]
const series = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
]
</script>

<template>
  <LineChart :data="data" x="month" :series="series" />
</template>
```

Series colours use `--chart-1` … `--chart-5` from the active palette. `ChartContainer` maps Unovis `--vis-*` variables onto popover/border/muted tokens so charts follow theme changes.

**Consumer notes**

1. `presetManfadUi()` is required for charts — it includes the rule that lets Unovis fill the height set by `ChartContainer`.
2. If you widen UnoCSS `content.pipeline.include` to plain `.ts`/`.js`, also exclude `node_modules`. Unovis embeds CSS in template strings; scanning those packages breaks the build:

```ts
pipeline: {
  include: [/\.(vue|[jt]sx?)($|\?)/],
  exclude: [/[\\/]node_modules[\\/]/],
},
```

## Excel (DLC)

Client-side spreadsheet import/export powered by [SheetJS `xlsx`](https://sheetjs.com), following the same round-trip pattern as kpom-ems bulk entry.

```bash
pnpm add xlsx
```

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { DataTable } from '@manfad99/ui'
import { Excel, ExcelExport, ExcelImport, type ExcelColumn } from '@manfad99/ui/excel'

const columns: ExcelColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'workhour', label: 'Work hours', type: 'number' },
  { key: 'salary', label: 'Salary', type: 'number' },
]
const rows = shallowRef([
  { id: '001', phone: '012-3456789', workhour: 160, salary: 3200 },
])
</script>

<template>
  <Excel v-model:rows="rows" :columns="columns" filename="payroll">
    <ExcelExport text="Export Excel" format="xlsx" />
    <ExcelExport text="Export CSV" format="csv" />
    <ExcelImport text="Import" />
  </Excel>
  <DataTable :columns="columns" :rows="rows" row-key="id" />
</template>
```

- Import **replaces** `rows`.
- Headers match column **label**, then **key** (normalized like kpom-ems).
- Default cell type is `string` (keeps MY phone leading zeros); opt into `type: 'number'`.
- Export writes string columns as Excel text (`@` format).

## Selected components

### SelectionChips

Renders selected `CheckboxTree` leaves as expandable group rows (`label`, `selected/total`, chips):

```vue
<script setup lang="ts">
import { SelectionChips } from '@manfad99/ui'

const groups = [{
  key: 'items',
  label: 'Items',
  children: [
    { value: 'item_create', label: 'Create items' },
    { value: 'item_modify', label: 'Modify items' },
  ],
}]
const values = ['item_create', 'item_modify']
</script>

<template>
  <SelectionChips :groups="groups" :values="values" />
</template>
```

### CodeBlock

Source display with line numbers. Muted `//` comments; `://` inside URLs is left alone.

```vue
<script setup lang="ts">
import { CodeBlock } from '@manfad99/ui'

const content = `// Apply the active palette
root.dataset.manfadComponentTheme = 'blue'
`
</script>

<template>
  <CodeBlock :content="content" />
</template>
```

### SignatureDialog

On Save, downloads a PNG (unless `:download="false"`) and emits the data URL:

```vue
<SignatureDialog
  v-model:open="open"
  filename="customer-signature.png"
  @save="signatureUrl = $event"
/>
```

### ModeToggle

Button that cycles through declarative `Mode` options. Optional keyboard shortcut cycles values — useful for view/mode switching:

```vue
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Mode, ModeToggle } from '@manfad99/ui'

const mode = shallowRef('docs')
</script>

<template>
  <ModeToggle v-model="mode" shortcut="d">
    <Mode value="docs">Document</Mode>
    <Mode value="playground">Playground</Mode>
    <Mode value="extra">Extra</Mode>
  </ModeToggle>
</template>
```

## AI / LLMs.txt

Structured context files for Cursor, Windsurf, ChatGPT, Claude, and similar tools:

| File | Purpose |
| --- | --- |
| [`llms.txt`](./llms.txt) | Index of getting-started docs and every component |
| [`llms-full.txt`](./llms-full.txt) | Full install, theming, DLC, and usage patterns |

Guide: [`docs/getting-started/ai/llms-txt.md`](./docs/getting-started/ai/llms-txt.md).

With the playground running (`pnpm dev`), they are also served at `/llms.txt` and `/llms-full.txt`.

Raw GitHub URLs (for `@Docs` / pasted context):

- https://raw.githubusercontent.com/manfad/manfad-ui/main/llms.txt
- https://raw.githubusercontent.com/manfad/manfad-ui/main/llms-full.txt

## License

MIT
