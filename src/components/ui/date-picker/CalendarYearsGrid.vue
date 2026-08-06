<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  years: number[]
  selected: number
}>()

const emit = defineEmits<{
  select: [year: number]
}>()

function yearClass(year: number) {
  return cn(
    'h-8 w-full rounded-md text-xs font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    year === props.selected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
  )
}
</script>

<template>
  <div class="grid grid-cols-3 gap-1.5">
    <button
      v-for="year in years"
      :key="year"
      type="button"
      :class="yearClass(year)"
      :aria-pressed="year === selected"
      @click="emit('select', year)"
    >
      {{ year }}
    </button>
  </div>
</template>
