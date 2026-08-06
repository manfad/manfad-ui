<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  months: string[]
  selected?: number[]
  inRange?: number[]
  rangeStart?: number
  rangeEnd?: number
}>(), {
  selected: () => [],
  inRange: () => [],
  rangeStart: undefined,
  rangeEnd: undefined,
})

const emit = defineEmits<{
  select: [month: number]
}>()

function isSelected(month: number) {
  return props.selected.includes(month)
}

function isInRange(month: number) {
  return props.inRange.includes(month)
}

const endpointRadius = 'calc(var(--radius, 0.5rem) - 2px)'

function isBandMonth(month: number) {
  const isStart = month === props.rangeStart
  const isEnd = month === props.rangeEnd
  return (isInRange(month) || isStart || isEnd) && !(isStart && isEnd)
}

function monthStyle(month: number) {
  if (!isBandMonth(month))
    return undefined

  const column = month % 3
  const roundLeft = month === props.rangeStart || column === 0
  const roundRight = month === props.rangeEnd || column === 2

  if (!roundLeft && !roundRight)
    return undefined

  const left = roundLeft ? endpointRadius : '0'
  const right = roundRight ? endpointRadius : '0'
  return { borderRadius: `${left} ${right} ${right} ${left}` }
}

function monthClass(month: number) {
  const column = month % 3

  return cn(
    'h-8 w-full rounded-md text-xs font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isInRange(month) && !isSelected(month) && 'rounded-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground -mx-px w-[calc(100%+2px)]',
    isInRange(month) && !isSelected(month) && column === 0 && 'ml-0 w-[calc(100%+1px)]',
    isInRange(month) && !isSelected(month) && column === 2 && 'w-[calc(100%+1px)]',
    isSelected(month) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
    month === props.rangeStart && 'rounded-none w-[calc(100%+1px)]',
    month === props.rangeStart && column === 2 && 'w-full',
    month === props.rangeEnd && 'rounded-none -ml-px w-[calc(100%+1px)]',
    month === props.rangeEnd && column === 0 && 'ml-0 w-full',
    month === props.rangeStart && month === props.rangeEnd && 'rounded-md ml-0 w-full',
  )
}
</script>

<template>
  <div class="grid grid-cols-3 gap-y-1.5">
    <button
      v-for="(name, month) in months"
      :key="name"
      type="button"
      :class="monthClass(month)"
      :style="monthStyle(month)"
      :aria-pressed="isSelected(month)"
      @click="emit('select', month)"
    >
      {{ name }}
    </button>
  </div>
</template>
