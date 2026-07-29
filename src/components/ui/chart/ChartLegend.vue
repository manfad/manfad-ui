<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useChartContext } from './context'
import type { ChartSeriesResolved } from './types'

const props = defineProps<{
  /** Defaults to the series config provided by the enclosing `ChartContainer`. */
  items?: ChartSeriesResolved[]
  class?: HTMLAttributes['class']
}>()

const context = useChartContext()

const entries = computed<ChartSeriesResolved[]>(() => {
  if (props.items)
    return props.items
  const config = context?.config.value ?? {}
  return Object.keys(config).map(key => ({
    key,
    label: config[key].label,
    color: config[key].color,
  }))
})
</script>

<template>
  <ul :class="cn('flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground', props.class)">
    <li
      v-for="entry in entries"
      :key="entry.key"
      class="flex items-center gap-1.5"
    >
      <span
        class="h-2.5 w-2.5 shrink-0 rounded-sm"
        :style="{ backgroundColor: entry.color }"
        aria-hidden="true"
      />
      <span>{{ entry.label }}</span>
    </li>
  </ul>
</template>
