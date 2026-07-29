# @manfad/ui

Reusable Vue 3 admin UI kit (shadcn-style components on UnoCSS).

## Usage in the template

The monorepo template consumes this package via the root pnpm workspace:

```json
"@manfad/ui": "workspace:*"
```

Install and build from the repository root:

```bash
cd ..
pnpm install
pnpm --filter @manfad/ui build
```

## Standalone development

```bash
pnpm install
pnpm dev        # playground (vue-router; one page per component)
pnpm build      # library dist/
pnpm typecheck
```

The playground is routed (`/buttons`, `/code-block`, `/charts`, …). `/` redirects
to `/buttons`. The sidebar groups components (Foundations, Forms, Tables, …)
with a sticky filter, and each page shows a live demo plus a Usage card.

## Exports

- `@manfad/ui` — components, composables, utilities
- `@manfad/ui/preset` — UnoCSS preset for consumer apps

```ts
presets: [presetWind3(), ...presetManfadUi({ color: 'blue', radius: 0.5 })]
```

## Code block

`CodeBlock` shows source with line numbers and muted `//` comments. Comments
after `://` (as in URLs) are left alone.

```vue
<script setup lang="ts">
import { CodeBlock } from '@manfad/ui'

const content = `// Apply the active palette
root.dataset.manfadComponentTheme = 'blue'
`
</script>

<template>
  <CodeBlock :content="content" />
</template>
```

## Badge summary

`BadgeSummary` turns selected CheckboxTree leaves into group rows — label,
`selected/total` count, and expandable leaf badges.

```vue
<script setup lang="ts">
import { BadgeSummary } from '@manfad/ui'

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
  <BadgeSummary :groups="groups" :values="values" />
</template>
```

## Charts

`LineChart`, `AreaChart`, `BarChart` and `DonutChart` wrap
[Unovis](https://unovis.dev) (`@unovis/vue` + `@unovis/ts`, pinned to matching
exact versions because Unovis peer-depends on itself by exact version).

```vue
<script setup lang="ts">
import { LineChart } from '@manfad/ui'

const data = [{ month: new Date(2025, 0, 1), kuching: 18420, miri: 12980 }]
const series = [{ key: 'kuching', label: 'Kuching' }, { key: 'miri', label: 'Miri' }]
const money = (value: number) => `RM ${value.toLocaleString('en-MY')}`
</script>

<template>
  <LineChart :data="data" x="month" :series="series" :y-formatter="money" />
</template>
```

Series colours default to `--chart-1` … `--chart-5`, and `ChartContainer`
re-points Unovis's `--vis-*` variables at `--popover`, `--border` and
`--muted-foreground`, so charts follow light/dark and the runtime palette
switcher without extra work.

Two things a consuming app must know:

- `presetManfadUi()` is required, not optional, for charts: it carries the rule that
  makes Unovis's container fill the height `ChartContainer` sets.
- If the app widens UnoCSS's `content.pipeline.include` to plain `.ts`/`.js`
  (the default does not include them), exclude `node_modules` as well. Unovis
  embeds raw CSS in template literals, which UnoCSS otherwise extracts into
  unparseable rules and the build fails:

  ```ts
  pipeline: {
    include: [/\.(vue|[jt]sx?)($|\?)/],
    exclude: [/[\\/]node_modules[\\/]/],
  },
  ```

## Colour theme

Blue is the default preset theme:

```ts
presets: [presetWind3(), ...presetManfadUi()]
```

It provides a royal-blue primary, a pale-blue secondary surface, a cyan-blue
tertiary role, and a red rival role. Backgrounds, cards, popovers, muted and
accent surfaces, form controls, borders, and the sidebar all use coordinated
blue tints in light and dark mode.

The rival is each palette's opposing accent: the hue that argues with the
primary instead of extending it, for the one element on a screen that has to
stand apart. Blue's rival is red, the neutral palette's is white, and every
palette picks its own.

All four roles use HSL CSS variables, so an application can still override
them in its global stylesheet:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --tertiary: 199 89% 33%;
  --tertiary-foreground: 0 0% 98%;
  --rival: 0 72% 45%;
  --rival-foreground: 0 0% 98%;
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --tertiary: 198 93% 60%;
  --tertiary-foreground: 202 80% 12%;
  --rival: 0 84% 65%;
  --rival-foreground: 0 60% 10%;
}
```

The `ThemePalettePicker` lets users select component and background palettes
independently:

```vue
<script setup lang="ts">
import { ThemePalettePicker } from '@manfad/ui'
</script>

<template>
  <ThemePalettePicker />
</template>
```

The selection persists in local storage and sets
`data-manfad-component-theme` and `data-manfad-background-theme` on the document
root. Available palettes are Neutral, Blue, Green, Orange, Rose, and Violet,
each with light and dark values. White is offered as a background only —
untinted surfaces, for screens that want the palette to show in the components
alone.

To show the active theme's tokens as labeled swatches, use `ThemePalette`:

```vue
<script setup lang="ts">
import { ThemePalette } from '@manfad/ui'
</script>

<template>
  <ThemePalette />
  <ThemePalette :tokens="['primary', 'rival', 'muted']" />
</template>
```

It renders from the tokens themselves, so it follows the picker and dark mode
without reading any colors in script.

Each palette also defines its own `--chart-1` through `--chart-5` series, built
around that palette's primary and rival hues, so charts follow the palette
picker along with everything else.

Values are HSL channels without the surrounding `hsl()` so opacity modifiers
continue to work. The roles are available as UnoCSS colours such as
`bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-rival`, and
`text-rival-foreground`. `Button` and `Badge` also accept
`variant="tertiary"` and `variant="rival"`; their existing default and
secondary variants use the primary and secondary roles respectively.
