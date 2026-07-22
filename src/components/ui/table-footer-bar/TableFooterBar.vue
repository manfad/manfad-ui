<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  total?: number
  selected?: number
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const autoText = computed(() => {
  if (props.total === undefined) return undefined
  const rows = props.total === 1 ? '1 row' : `${props.total} rows`
  return props.selected && props.selected > 0
    ? `${rows} · ${props.selected} selected`
    : rows
})
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center justify-between gap-3 border-t px-3 py-2 text-sm text-muted-foreground',
        props.class,
      )
    "
  >
    <div class="min-w-0">
      <slot name="start">
        <span v-if="autoText !== undefined">{{ autoText }}</span>
      </slot>
    </div>
    <div class="flex items-center">
      <slot />
    </div>
  </div>
</template>
