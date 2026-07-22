<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import CalendarDaysGrid from './CalendarDaysGrid.vue'
import CalendarMonthsGrid from './CalendarMonthsGrid.vue'
import CalendarYearsGrid from './CalendarYearsGrid.vue'
import type { CalendarDay } from './types'
import { formatDate, normalizeExclude, normalizeRestday, parseDate, type RestDay } from './utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  range?: boolean
  restday?: RestDay[]
  exclude?: string | string[]
  restdayClass?: HTMLAttributes['class']
  excludeClass?: HTMLAttributes['class']
}>(), {
  range: false,
})

type CalendarView = 'days' | 'months' | 'years'

const modelValue = defineModel<string>()
const rangeStart = defineModel<string>('start')
const rangeEnd = defineModel<string>('end')
const initialDate = parseDate(modelValue.value ?? '')
  ?? parseDate(rangeStart.value ?? '')
  ?? new Date()
const displayedMonth = shallowRef(initialDate.getMonth())
const displayedYear = shallowRef(initialDate.getFullYear())
const today = formatDate(new Date())

const view = shallowRef<CalendarView>('days')
const yearPageStart = shallowRef(initialDate.getFullYear() - 6)

const restdaySet = computed(() => normalizeRestday(props.restday))
const excludeSet = computed(() => normalizeExclude(props.exclude))

const monthLabel = computed(() => new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
}).format(new Date(displayedYear.value, displayedMonth.value, 1)))

const monthNames = computed(() => {
  const format = new Intl.DateTimeFormat('en', { month: 'short' })
  return Array.from({ length: 12 }, (_, month) =>
    format.format(new Date(2000, month, 1)))
})

const yearPage = computed(() =>
  Array.from({ length: 12 }, (_, index) => yearPageStart.value + index))

const yearRangeLabel = computed(() =>
  `${yearPageStart.value} – ${yearPageStart.value + 11}`)

const headerLabel = computed(() => {
  if (view.value === 'months')
    return String(displayedYear.value)

  if (view.value === 'years')
    return yearRangeLabel.value

  return monthLabel.value
})

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
    const isRestday = restdaySet.value.has(date.getDay())
    const isExcluded = excludeSet.value.has(value)
    const start = rangeStart.value
    const end = rangeEnd.value
    const isSelected = props.range
      ? value === start || (!!end && value === end)
      : value === modelValue.value

    return {
      date,
      value,
      isCurrentMonth: date.getMonth() === displayedMonth.value
        && date.getFullYear() === displayedYear.value,
      isSelected,
      isToday: value === today,
      isRestday,
      isExcluded,
      isDisabled: isRestday || isExcluded,
      isInRange: props.range && !!start && !!end && value > start && value < end,
    }
  })
})

watch([modelValue, rangeStart], ([value, start]) => {
  const date = parseDate((props.range ? start : value) ?? '')

  if (date) {
    displayedMonth.value = date.getMonth()
    displayedYear.value = date.getFullYear()
  }

  view.value = 'days'
})

function changeMonth(offset: number) {
  const date = new Date(displayedYear.value, displayedMonth.value + offset, 1)
  displayedMonth.value = date.getMonth()
  displayedYear.value = date.getFullYear()
}

function stepHeader(offset: number) {
  if (view.value === 'months')
    displayedYear.value += offset
  else if (view.value === 'years')
    yearPageStart.value += offset * 12
  else
    changeMonth(offset)
}

function onHeaderLabel() {
  if (view.value === 'days') {
    view.value = 'months'
  }
  else if (view.value === 'months') {
    yearPageStart.value = displayedYear.value - 6
    view.value = 'years'
  }
}

function selectMonth(month: number) {
  displayedMonth.value = month
  view.value = 'days'
}

function selectYear(year: number) {
  displayedYear.value = year
  view.value = 'months'
}

function selectRangeDay(value: string) {
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

function selectDay(day: CalendarDay) {
  if (day.isDisabled)
    return

  if (props.range)
    selectRangeDay(day.value)
  else
    modelValue.value = day.value

  if (!day.isCurrentMonth) {
    displayedMonth.value = day.date.getMonth()
    displayedYear.value = day.date.getFullYear()
  }

  view.value = 'days'
}
</script>

<template>
  <div :class="cn('w-[252px]', props.class)">
    <div class="relative flex items-center justify-center pb-3">
      <button
        type="button"
        class="absolute left-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        :aria-label="view === 'months' ? 'Previous year' : view === 'years' ? 'Previous years' : 'Previous month'"
        @click="stepHeader(-1)"
      >
        <span class="i-lucide-chevron-left h-4 w-4" />
      </button>
      <button
        v-if="view !== 'years'"
        type="button"
        class="rounded-md px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change month and year"
        @click="onHeaderLabel"
      >
        {{ headerLabel }}
      </button>
      <div v-else class="px-2 py-1 text-sm font-medium">
        {{ headerLabel }}
      </div>
      <button
        type="button"
        class="absolute right-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        :aria-label="view === 'months' ? 'Next year' : view === 'years' ? 'Next years' : 'Next month'"
        @click="stepHeader(1)"
      >
        <span class="i-lucide-chevron-right h-4 w-4" />
      </button>
    </div>

    <CalendarDaysGrid
      v-if="view === 'days'"
      :days="days"
      :restday-class="restdayClass"
      :exclude-class="excludeClass"
      @select="selectDay"
    />

    <CalendarMonthsGrid
      v-else-if="view === 'months'"
      :months="monthNames"
      :selected="displayedMonth"
      @select="selectMonth"
    />

    <CalendarYearsGrid
      v-else
      :years="yearPage"
      :selected="displayedYear"
      @select="selectYear"
    />
  </div>
</template>
