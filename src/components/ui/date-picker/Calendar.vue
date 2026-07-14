<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import { formatDate, parseDate } from './utils'

interface CalendarDay {
  date: Date
  value: string
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string>()
const initialDate = parseDate(modelValue.value ?? '') ?? new Date()
const displayedMonth = shallowRef(initialDate.getMonth())
const displayedYear = shallowRef(initialDate.getFullYear())
const today = formatDate(new Date())

const monthLabel = computed(() => new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
}).format(new Date(displayedYear.value, displayedMonth.value, 1)))

const days = computed<CalendarDay[]>(() => {
  const firstOfMonth = new Date(displayedYear.value, displayedMonth.value, 1)
  const gridStart = new Date(displayedYear.value, displayedMonth.value, 1 - firstOfMonth.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    )
    const value = formatDate(date)

    return {
      date,
      value,
      isCurrentMonth: date.getMonth() === displayedMonth.value
        && date.getFullYear() === displayedYear.value,
      isSelected: value === modelValue.value,
      isToday: value === today,
    }
  })
})

watch(modelValue, (value) => {
  const date = parseDate(value ?? '')

  if (date) {
    displayedMonth.value = date.getMonth()
    displayedYear.value = date.getFullYear()
  }
})

function changeMonth(offset: number) {
  const date = new Date(displayedYear.value, displayedMonth.value + offset, 1)
  displayedMonth.value = date.getMonth()
  displayedYear.value = date.getFullYear()
}

function selectDay(day: CalendarDay) {
  modelValue.value = day.value

  if (!day.isCurrentMonth) {
    displayedMonth.value = day.date.getMonth()
    displayedYear.value = day.date.getFullYear()
  }
}
</script>

<template>
  <div :class="cn('w-[252px]', props.class)">
    <div class="relative flex items-center justify-center pb-3">
      <button
        type="button"
        class="absolute left-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        aria-label="Previous month"
        @click="changeMonth(-1)"
      >
        <span class="i-lucide-chevron-left h-4 w-4" />
      </button>
      <div class="text-sm font-medium">
        {{ monthLabel }}
      </div>
      <button
        type="button"
        class="absolute right-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        aria-label="Next month"
        @click="changeMonth(1)"
      >
        <span class="i-lucide-chevron-right h-4 w-4" />
      </button>
    </div>

    <div class="grid grid-cols-7">
      <div
        v-for="weekday in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
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
        :class="cn(
          'h-9 w-9 rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          !day.isCurrentMonth && 'text-muted-foreground opacity-50',
          day.isToday && !day.isSelected && 'bg-accent text-accent-foreground',
          day.isSelected && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
        )"
        :aria-label="day.date.toLocaleDateString('en', { dateStyle: 'long' })"
        :aria-pressed="day.isSelected"
        @click="selectDay(day)"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>
