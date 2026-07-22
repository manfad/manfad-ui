<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps<{
  months: string[]
  selected: number
}>()

const emit = defineEmits<{
  select: [month: number]
}>()

function monthClass(month: number) {
  return cn(
    'h-9 w-full rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    month === props.selected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
  )
}
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="(name, month) in months"
      :key="name"
      type="button"
      :class="monthClass(month)"
      :aria-pressed="month === selected"
      @click="emit('select', month)"
    >
      {{ name }}
    </button>
  </div>
</template>
