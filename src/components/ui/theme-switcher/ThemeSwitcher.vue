<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ManfadUiPalette } from '@/theme/palettes'
import { manfadUiPalettes } from '@/theme/palettes'
import { useThemePalette } from './useThemePalette'

const props = withDefaults(defineProps<{
  storageKey?: string
}>(), {
  storageKey: 'manfad-ui-theme',
})

const {
  componentTheme,
  backgroundTheme,
  setComponentTheme,
  setBackgroundTheme,
} = useThemePalette({ storageKey: props.storageKey })

/** A palette can suit one role and not the other, so the two rows differ. */
const componentPalettes = manfadUiPalettes.filter(palette => !palette.backgroundOnly)
const backgroundPalettes = manfadUiPalettes.filter(palette => !palette.componentOnly)

function swatchStyle(channels: string): CSSProperties {
  return { backgroundColor: `hsl(${channels})` }
}

function backgroundSwatch(palette: ManfadUiPalette): CSSProperties {
  return swatchStyle(palette.swatch ?? palette.background.light.accent)
}
</script>

<template>
  <div class="space-y-3" aria-label="Theme palettes">
    <fieldset class="space-y-2">
      <legend class="text-xs font-medium text-sidebar-foreground">Components</legend>
      <div class="flex flex-wrap items-center justify-between gap-1">
        <button
          v-for="palette in componentPalettes"
          :key="`component-${palette.name}`"
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          :class="componentTheme === palette.name && 'ring-2 ring-sidebar-ring ring-offset-2 ring-offset-sidebar'"
          :style="swatchStyle(palette.component.light.primary)"
          :aria-label="`${palette.label} component palette`"
          :aria-pressed="componentTheme === palette.name"
          :title="palette.label"
          @click="setComponentTheme(palette.name)"
        >
          <span
            v-if="componentTheme === palette.name"
            class="i-lucide-check h-3.5 w-3.5 text-white drop-shadow"
            aria-hidden="true"
          />
        </button>
      </div>
    </fieldset>

    <fieldset class="space-y-2">
      <legend class="text-xs font-medium text-sidebar-foreground">Background</legend>
      <div class="flex flex-wrap items-center justify-between gap-1">
        <button
          v-for="palette in backgroundPalettes"
          :key="`background-${palette.name}`"
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          :class="backgroundTheme === palette.name && 'ring-2 ring-sidebar-ring ring-offset-2 ring-offset-sidebar'"
          :style="backgroundSwatch(palette)"
          :aria-label="`${palette.label} background palette`"
          :aria-pressed="backgroundTheme === palette.name"
          :title="palette.label"
          @click="setBackgroundTheme(palette.name)"
        >
          <span
            v-if="backgroundTheme === palette.name"
            class="i-lucide-check h-3.5 w-3.5 text-sidebar-foreground"
            aria-hidden="true"
          />
        </button>
      </div>
    </fieldset>
  </div>
</template>
