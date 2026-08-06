<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { CalendarDay } from './types'

const props = defineProps<{
  days: CalendarDay[]
  restdayClass?: HTMLAttributes['class']
  excludeClass?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  select: [day: CalendarDay]
}>()

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const endpointRadius = 'calc(var(--radius, 0.5rem) - 2px)'

function isBandDay(day: CalendarDay) {
  return (day.isInRange || day.isRangeStart || day.isRangeEnd)
    && !(day.isRangeStart && day.isRangeEnd)
}

function dayStyle(day: CalendarDay, index: number) {
  if (!isBandDay(day))
    return undefined

  const column = index % 7
  const roundLeft = day.isRangeStart || column === 0
  const roundRight = day.isRangeEnd || column === 6

  if (!roundLeft && !roundRight)
    return undefined

  const left = roundLeft ? endpointRadius : '0'
  const right = roundRight ? endpointRadius : '0'
  return { borderRadius: `${left} ${right} ${right} ${left}` }
}

function dayClass(day: CalendarDay, index: number) {
  const column = index % 7

  return cn(
    'h-8 w-full rounded-md text-xs font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50',
    !day.isCurrentMonth && !day.isInRange && !day.isSelected && 'text-muted-foreground opacity-50',
    day.isInRange && !day.isSelected && 'rounded-none bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground -mx-px w-[calc(100%+2px)]',
    day.isInRange && !day.isSelected && column === 0 && 'ml-0 w-[calc(100%+1px)]',
    day.isInRange && !day.isSelected && column === 6 && 'w-[calc(100%+1px)]',
    day.isToday && !day.isSelected && !day.isInRange && 'bg-accent text-accent-foreground',
    day.isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
    day.isRangeStart && 'rounded-none w-[calc(100%+1px)]',
    day.isRangeStart && column === 6 && 'w-full',
    day.isRangeEnd && 'rounded-none -ml-px w-[calc(100%+1px)]',
    day.isRangeEnd && column === 0 && 'ml-0 w-full',
    day.isRangeStart && day.isRangeEnd && 'rounded-md ml-0 w-full',
    day.isRestday && props.restdayClass,
    day.isExcluded && props.excludeClass,
  )
}
</script>

<template>
  <div class="grid grid-cols-7">
    <div
      v-for="weekday in weekdays"
      :key="weekday"
      class="flex h-8 w-full items-center justify-center text-[10px] font-normal text-muted-foreground"
    >
      {{ weekday }}
    </div>
  </div>

  <div class="grid grid-cols-7 gap-y-1">
    <button
      v-for="(day, index) in days"
      :key="day.value"
      type="button"
      :disabled="day.isDisabled"
      :data-restday="day.isRestday ? '' : undefined"
      :data-excluded="day.isExcluded ? '' : undefined"
      :class="dayClass(day, index)"
      :style="dayStyle(day, index)"
      :aria-label="day.date.toLocaleDateString('en', { dateStyle: 'long' })"
      :aria-pressed="day.isSelected"
      @click="emit('select', day)"
    >
      {{ day.date.getDate() }}
    </button>
  </div>
</template>
