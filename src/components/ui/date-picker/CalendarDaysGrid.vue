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

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function dayClass(day: CalendarDay) {
  return cn(
    'h-9 w-9 rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-muted-foreground disabled:opacity-50',
    !day.isCurrentMonth && 'text-muted-foreground opacity-50',
    day.isInRange && !day.isSelected && 'rounded-none bg-primary/10',
    day.isToday && !day.isSelected && 'bg-accent text-accent-foreground',
    day.isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
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
      class="flex h-9 w-9 items-center justify-center text-xs font-normal text-muted-foreground"
    >
      {{ weekday }}
    </div>
  </div>

  <div class="grid grid-cols-7">
    <button
      v-for="day in days"
      :key="day.value"
      type="button"
      :disabled="day.isDisabled"
      :data-restday="day.isRestday ? '' : undefined"
      :data-excluded="day.isExcluded ? '' : undefined"
      :class="dayClass(day)"
      :aria-label="day.date.toLocaleDateString('en', { dateStyle: 'long' })"
      :aria-pressed="day.isSelected"
      @click="emit('select', day)"
    >
      {{ day.date.getDate() }}
    </button>
  </div>
</template>
