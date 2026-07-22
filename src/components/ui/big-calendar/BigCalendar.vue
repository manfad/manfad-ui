<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { BigCalendarDay, BigCalendarWeekStart } from './types'
import { computed, shallowRef, watch } from 'vue'
import BigCalendarGrid from './BigCalendarGrid.vue'
import BigCalendarHeader from './BigCalendarHeader.vue'
import { formatDate, parseDate } from '@/components/ui/date-picker/utils'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    locale?: string
    weekStartsOn?: BigCalendarWeekStart
    range?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    locale: 'en',
    weekStartsOn: 0,
    range: false,
  },
)

const emit = defineEmits<{
  dayClick: [value: string]
  monthChange: [value: string]
}>()

const modelValue = defineModel<string>()
const rangeStart = defineModel<string>('start')
const rangeEnd = defineModel<string>('end')
const initialDate = parseDate(modelValue.value ?? '')
  ?? parseDate(rangeStart.value ?? '')
  ?? new Date()
const displayedMonth = shallowRef(initialDate.getMonth())
const displayedYear = shallowRef(initialDate.getFullYear())
const today = formatDate(new Date())

const monthLabel = computed(() => new Intl.DateTimeFormat(props.locale, {
  month: 'long',
  year: 'numeric',
}).format(new Date(displayedYear.value, displayedMonth.value, 1)))

const weekdayLabels = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { weekday: 'short' })
  const sunday = new Date(2024, 0, 7)

  return Array.from({ length: 7 }, (_, index) => {
    const offset = (props.weekStartsOn + index) % 7
    return formatter.format(new Date(2024, 0, sunday.getDate() + offset))
  })
})

const days = computed<BigCalendarDay[]>(() => {
  const firstOfMonth = new Date(displayedYear.value, displayedMonth.value, 1)
  const leadingDays = (firstOfMonth.getDay() - props.weekStartsOn + 7) % 7
  const gridStart = new Date(displayedYear.value, displayedMonth.value, 1 - leadingDays)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    )
    const value = formatDate(date)
    const start = rangeStart.value
    const end = rangeEnd.value
    const isSelected = props.range
      ? value === start || (!!end && value === end)
      : value === modelValue.value

    return {
      date,
      value,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === displayedMonth.value
        && date.getFullYear() === displayedYear.value,
      isSelected,
      isToday: value === today,
      isInRange: props.range && !!start && !!end && value > start && value < end,
    }
  })
})

watch([modelValue, rangeStart], ([value, start]) => {
  const date = parseDate((props.range ? start : value) ?? '')
  if (!date)
    return

  displayedMonth.value = date.getMonth()
  displayedYear.value = date.getFullYear()
})

function monthValue(year: number, month: number): string {
  return `${String(year).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}`
}

function showMonth(date: Date): void {
  displayedMonth.value = date.getMonth()
  displayedYear.value = date.getFullYear()
  emit('monthChange', monthValue(displayedYear.value, displayedMonth.value))
}

function changeMonth(offset: number): void {
  showMonth(new Date(displayedYear.value, displayedMonth.value + offset, 1))
}

function showToday(): void {
  showMonth(new Date())
}

function selectRangeDay(value: string): void {
  const start = rangeStart.value
  const end = rangeEnd.value

  if (!start || (start && end)) {
    rangeStart.value = value
    rangeEnd.value = undefined
  }
  else if (value >= start) {
    rangeEnd.value = value
  }
  else {
    rangeStart.value = value
    rangeEnd.value = undefined
  }
}

function selectDay(day: BigCalendarDay): void {
  if (props.range)
    selectRangeDay(day.value)
  else
    modelValue.value = day.value

  emit('dayClick', day.value)

  if (!day.isCurrentMonth)
    showMonth(day.date)
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('overflow-auto rounded-lg border bg-background text-foreground', props.class)"
  >
    <div class="min-w-[42rem]">
      <BigCalendarHeader
        :label="monthLabel"
        :month="displayedMonth"
        :year="displayedYear"
        :locale="locale"
        @previous="changeMonth(-1)"
        @next="changeMonth(1)"
        @today="showToday"
        @pick="(year, month) => showMonth(new Date(year, month, 1))"
      />
      <BigCalendarGrid
        :days="days"
        :weekday-labels="weekdayLabels"
        :locale="locale"
        @select="selectDay"
      />
    </div>
  </div>
</template>
