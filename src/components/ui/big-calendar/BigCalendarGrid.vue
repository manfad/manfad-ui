<script setup lang="ts">
import type { BigCalendarDay } from './types'
import { cn } from '@/lib/utils'

defineProps<{
  days: BigCalendarDay[]
  weekdayLabels: string[]
  locale: string
}>()

defineEmits<{
  select: [day: BigCalendarDay]
}>()

function accessibleDate(day: BigCalendarDay, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(day.date)
}
</script>

<template>
  <div class="grid grid-cols-7 border-b bg-muted/30" role="row">
    <div
      v-for="label in weekdayLabels"
      :key="label"
      class="border-r px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground last:border-r-0"
      role="columnheader"
    >
      {{ label }}
    </div>
  </div>

  <div class="big-calendar-weeks grid grid-cols-7" role="grid">
    <button
      v-for="day in days"
      :key="day.value"
      type="button"
      :class="cn(
        'group relative flex min-h-24 items-start justify-center border-b border-r p-2.5 text-center transition-colors',
        'hover:bg-accent/60 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
        '[&:nth-child(7n)]:border-r-0 [&:nth-last-child(-n+7)]:border-b-0',
        !day.isCurrentMonth && 'bg-muted/10 text-muted-foreground/60',
        day.isInRange && 'bg-primary/10',
        day.isSelected && 'bg-muted/60 hover:bg-muted/80',
      )"
      :aria-label="accessibleDate(day, locale)"
      :aria-current="day.isToday ? 'date' : undefined"
      :aria-pressed="day.isSelected"
      role="gridcell"
      @click="$emit('select', day)"
    >
      <span
        :class="cn(
          'inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-sm font-medium transition-transform group-hover:scale-105',
          day.isToday && !day.isSelected && 'bg-accent text-accent-foreground',
          day.isSelected && 'bg-primary text-primary-foreground',
        )"
      >
        {{ day.dayNumber }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.big-calendar-weeks {
  grid-template-rows: repeat(6, minmax(6rem, 1fr));
}
</style>
