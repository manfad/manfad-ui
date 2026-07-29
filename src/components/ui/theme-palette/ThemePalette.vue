<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { type ManfadUiThemeToken, manfadUiThemeTokenClasses, manfadUiThemeTokenDefaults } from '.'

const props = defineProps<{
  tokens?: readonly ManfadUiThemeToken[]
  class?: HTMLAttributes['class']
}>()

/*
 * Every swatch resolves through the design tokens rather than a color read out
 * in script, so the display follows the palette picker and dark mode on its own.
 */
const swatches = computed(() => (props.tokens ?? manfadUiThemeTokenDefaults).map((token) => {
  const utility = manfadUiThemeTokenClasses[token]
  return {
    token,
    utility,
    style: utility ? undefined : { backgroundColor: `hsl(var(--${token}))` } as CSSProperties,
  }
}))
</script>

<template>
  <div :class="cn('flex flex-wrap gap-3', props.class)">
    <div
      v-for="swatch in swatches"
      :key="swatch.token"
      class="flex flex-col items-center gap-1.5"
    >
      <!-- The border keeps white and background swatches from vanishing. -->
      <div
        class="h-12 w-12 rounded-md border border-border"
        :class="swatch.utility"
        :style="swatch.style"
      />
      <span class="text-xs text-muted-foreground">{{ swatch.token }}</span>
    </div>
  </div>
</template>
