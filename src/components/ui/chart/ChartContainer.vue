<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import { CHART_CONTEXT_KEY } from './context'
import type { ChartConfig } from './types'
import { chartVisCssVars, toCssLength } from './utils'

const props = withDefaults(defineProps<{
  /** Series metadata (`key` → label + color) shared with legends and tooltips. */
  config?: ChartConfig
  /** Height of the plotting area. Plain numbers are pixels. Default: `320`. */
  height?: number | string
  class?: HTMLAttributes['class']
}>(), {
  height: 320,
})

const config = computed<ChartConfig>(() => props.config ?? {})

provide(CHART_CONTEXT_KEY, { config })

const plotStyle = computed(() => ({ height: toCssLength(props.height) }))
</script>

<template>
  <div
    :class="cn('flex w-full flex-col gap-3 text-sm', props.class)"
    :style="chartVisCssVars"
  >
    <div class="relative w-full" :style="plotStyle">
      <slot />
    </div>
    <slot name="legend" />
  </div>
</template>
