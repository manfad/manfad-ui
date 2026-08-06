# Theming

> Palettes, CSS variables, and theme switching for `@manfad99/ui`.

Blue is the default palette. Presets expose coordinated roles for primary, secondary, tertiary, rival, surfaces, forms, and the sidebar in light and dark mode.

**Rival** is the opposing accent — the hue that stands apart from the primary (for example red against blue). Use it sparingly for emphasis.

## CSS variables

Override tokens with HSL channels (no wrapping `hsl()`), so opacity modifiers keep working:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --rival: 0 72% 45%;
  --rival-foreground: 0 0% 98%;
}
```

## ThemeSwitcher and ThemePalette

`ThemeSwitcher` persists component and background palette choices on `document.documentElement` as `data-manfad-component-theme` and `data-manfad-background-theme`. Available palettes: Neutral, Blue, Green, Orange, Rose, Violet. White is background-only.

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
