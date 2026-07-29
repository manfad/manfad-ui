<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { yfUiPalettes } from '@/theme/palettes'
import { useThemePalette } from './useThemePalette'

const props = withDefaults(defineProps<{
  storageKey?: string
}>(), {
  storageKey: 'yf-ui-theme',
})

const {
  componentTheme,
  backgroundTheme,
  setComponentTheme,
  setBackgroundTheme,
} = useThemePalette({ storageKey: props.storageKey })

function swatchStyle(channels: string): CSSProperties {
  return { backgroundColor: `hsl(${channels})` }
}
</script>

<template>
  <div class="space-y-3" aria-label="Theme palettes">
    <fieldset class="space-y-2">
      <legend class="text-xs font-medium text-sidebar-foreground">Components</legend>
      <div class="flex items-center justify-between gap-1.5">
        <button
          v-for="palette in yfUiPalettes"
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
      <div class="flex items-center justify-between gap-1.5">
        <button
          v-for="palette in yfUiPalettes"
          :key="`background-${palette.name}`"
          type="button"
          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-sidebar-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
          :class="backgroundTheme === palette.name && 'ring-2 ring-sidebar-ring ring-offset-2 ring-offset-sidebar'"
          :style="swatchStyle(palette.background.light.accent)"
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
