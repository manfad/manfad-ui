<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import CalendarDaysGrid from './CalendarDaysGrid.vue'
import CalendarMonthsGrid from './CalendarMonthsGrid.vue'
import CalendarYearsGrid from './CalendarYearsGrid.vue'
import type { CalendarDay } from './types'
import { endOfWeek, formatDate, formatMonth, normalizeExclude, normalizeRestday, parseDate, parseMonth, startOfWeek, type RestDay } from './utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  range?: boolean
  /** Pick a month (`YYYY-MM`) instead of a day (`YYYY-MM-DD`). */
  month?: boolean
  /** Snap range selection to full weeks (Sunday–Saturday). */
  week?: boolean
  restday?: RestDay[]
  exclude?: string | string[]
  restdayClass?: HTMLAttributes['class']
  excludeClass?: HTMLAttributes['class']
}>(), {
  range: false,
  month: false,
  week: false,
})

type CalendarView = 'days' | 'months' | 'years'

const modelValue = defineModel<string>()
const rangeStart = defineModel<string>('start')
const rangeEnd = defineModel<string>('end')

const initialDate = props.month
  ? (parseMonth((props.range ? rangeStart.value : modelValue.value) ?? '')
    ?? parseMonth(modelValue.value ?? '')
    ?? new Date())
  : (parseDate(modelValue.value ?? '')
    ?? parseDate(rangeStart.value ?? '')
    ?? new Date())

const displayedMonth = shallowRef(initialDate.getMonth())
const displayedYear = shallowRef(initialDate.getFullYear())
const today = formatDate(new Date())
const todayMonth = formatMonth(new Date())

const view = shallowRef<CalendarView>(props.month ? 'months' : 'days')
const yearPageStart = shallowRef(initialDate.getFullYear() - 6)

const restdaySet = computed(() => normalizeRestday(props.restday))
const excludeSet = computed(() => normalizeExclude(props.exclude))

const monthLabel = computed(() => new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
}).format(new Date(displayedYear.value, displayedMonth.value, 1)))

const monthNames = computed(() => {
  const format = new Intl.DateTimeFormat('en', {
    month: props.month ? 'long' : 'short',
  })
  return Array.from({ length: 12 }, (_, month) =>
    format.format(new Date(2000, month, 1)))
})

const monthSelectionValues = computed(() => {
  if (!props.month)
    return { start: undefined as string | undefined, end: undefined as string | undefined }

  if (props.range) {
    return {
      start: rangeStart.value,
      end: rangeEnd.value,
    }
  }

  return {
    start: modelValue.value,
    end: undefined as string | undefined,
  }
})

const selectedMonths = computed(() => {
  if (!props.month)
    return [displayedMonth.value]

  const selected: number[] = []
  const { start, end } = monthSelectionValues.value
  const startDate = parseMonth(start ?? '')
  const endDate = parseMonth(end ?? '')

  if (startDate && startDate.getFullYear() === displayedYear.value)
    selected.push(startDate.getMonth())

  if (
    endDate
    && endDate.getFullYear() === displayedYear.value
    && endDate.getMonth() !== startDate?.getMonth()
  ) {
    selected.push(endDate.getMonth())
  }

  return selected
})

const inRangeMonths = computed(() => {
  if (!props.month || !props.range)
    return []

  const { start, end } = monthSelectionValues.value

  if (!start || !end)
    return []

  return Array.from({ length: 12 }, (_, month) => {
    const value = formatMonth(new Date(displayedYear.value, month, 1))
    return value > start && value < end ? month : -1
  }).filter(month => month >= 0)
})

const rangeStartMonth = computed(() => {
  if (!props.month || !props.range)
    return undefined

  const { start, end } = monthSelectionValues.value

  if (!start || !end)
    return undefined

  const date = parseMonth(start)
  return date && date.getFullYear() === displayedYear.value ? date.getMonth() : undefined
})

const rangeEndMonth = computed(() => {
  if (!props.month || !props.range)
    return undefined

  const { start, end } = monthSelectionValues.value

  if (!start || !end)
    return undefined

  const date = parseMonth(end)
  return date && date.getFullYear() === displayedYear.value ? date.getMonth() : undefined
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
      isRangeStart: props.range && !!start && !!end && value === start,
      isRangeEnd: props.range && !!start && !!end && value === end,
    }
  })
})

watch([modelValue, rangeStart], ([value, start]) => {
  const date = props.month
    ? parseMonth((props.range ? start : value) ?? '') ?? parseMonth(value ?? '')
    : parseDate((props.range ? start : value) ?? '')

  if (date) {
    displayedMonth.value = date.getMonth()
    displayedYear.value = date.getFullYear()
  }

  if (!props.month)
    view.value = 'days'
  else if (view.value === 'days')
    view.value = 'months'
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

function selectRangeMonth(value: string) {
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

function selectMonth(month: number) {
  displayedMonth.value = month

  if (props.month) {
    const value = formatMonth(new Date(displayedYear.value, month, 1))

    if (props.range)
      selectRangeMonth(value)
    else
      modelValue.value = value

    return
  }

  view.value = 'days'
}

function selectYear(year: number) {
  displayedYear.value = year
  view.value = 'months'
}

function weekBounds(value: string) {
  const date = parseDate(value)

  if (!date)
    return null

  return {
    start: formatDate(startOfWeek(date)),
    end: formatDate(endOfWeek(date)),
  }
}

function selectRangeDay(value: string) {
  if (props.week) {
    const bounds = weekBounds(value)

    if (!bounds)
      return

    rangeStart.value = bounds.start
    rangeEnd.value = bounds.end
    return
  }

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

function goToToday() {
  const now = new Date()
  displayedMonth.value = now.getMonth()
  displayedYear.value = now.getFullYear()
  yearPageStart.value = now.getFullYear() - 6

  if (props.month) {
    view.value = 'months'

    if (props.range) {
      rangeStart.value = todayMonth
      rangeEnd.value = undefined
    }
    else {
      modelValue.value = todayMonth
    }

    return
  }

  view.value = 'days'

  if (props.range) {
    if (props.week) {
      rangeStart.value = formatDate(startOfWeek(now))
      rangeEnd.value = formatDate(endOfWeek(now))
    }
    else {
      rangeStart.value = today
      rangeEnd.value = undefined
    }
  }
  else {
    modelValue.value = today
  }
}

defineExpose({
  goToToday,
})
</script>

<template>
  <div :class="cn('w-[224px]', props.class)">
    <div class="relative flex items-center justify-center pb-2">
      <button
        type="button"
        class="absolute left-0 inline-flex size-6 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        :aria-label="view === 'months' ? 'Previous year' : view === 'years' ? 'Previous years' : 'Previous month'"
        @click="stepHeader(-1)"
      >
        <span class="i-lucide-chevron-left size-3.5" />
      </button>
      <button
        v-if="view !== 'years'"
        type="button"
        class="rounded-md px-1.5 py-0.5 text-xs font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change month and year"
        @click="onHeaderLabel"
      >
        {{ headerLabel }}
      </button>
      <div v-else class="px-1.5 py-0.5 text-xs font-medium">
        {{ headerLabel }}
      </div>
      <button
        type="button"
        class="absolute right-0 inline-flex size-6 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
        :aria-label="view === 'months' ? 'Next year' : view === 'years' ? 'Next years' : 'Next month'"
        @click="stepHeader(1)"
      >
        <span class="i-lucide-chevron-right size-3.5" />
      </button>
    </div>

    <CalendarDaysGrid
      v-if="view === 'days' && !month"
      :days="days"
      :restday-class="restdayClass"
      :exclude-class="excludeClass"
      @select="selectDay"
    />

    <CalendarMonthsGrid
      v-else-if="view === 'months'"
      :months="monthNames"
      :selected="selectedMonths"
      :in-range="inRangeMonths"
      :range-start="rangeStartMonth"
      :range-end="rangeEndMonth"
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
