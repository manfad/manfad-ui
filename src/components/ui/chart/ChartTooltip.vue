<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { ChartTooltipItem } from './types'

/*
 * Rendered inside Unovis's own tooltip element, whose border, background and
 * radius already come from the `--vis-tooltip-*` overrides in `utils.ts`
 * (padding there is zeroed so this component owns the inner spacing).
 */
const props = defineProps<{
  title?: string
  items: ChartTooltipItem[]
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('min-w-32 px-3 py-2 text-xs leading-normal', props.class)">
    <p v-if="props.title" class="mb-1.5 font-medium text-popover-foreground">
      {{ props.title }}
    </p>
    <ul class="flex flex-col gap-1">
      <li
        v-for="item in props.items"
        :key="item.key"
        class="flex items-center gap-2"
      >
        <span
          v-if="item.color"
          class="h-2.5 w-2.5 shrink-0 rounded-sm"
          :style="{ backgroundColor: item.color }"
          aria-hidden="true"
        />
        <span class="text-muted-foreground">{{ item.label }}</span>
        <span class="ml-auto pl-4 font-medium tabular-nums text-popover-foreground">
          {{ item.value }}
        </span>
      </li>
    </ul>
  </div>
</template>
