<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/date-picker'
import { endOfWeek, formatDate, formatMonth, parseDate, parseMonth, startOfWeek } from '@/components/ui/date-picker/utils'
import { InputClear } from '@/components/ui/input-clear'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export type DateFilterMode = 'date' | 'month'
export type DateSelection = 'single' | 'range' | 'week'
export type MonthSelection = 'single' | 'multiple'

const props = withDefaults(defineProps<{
  label?: string
  triggerLabel?: string
  placeholder?: string
  locale?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
}>(), {
  label: 'Date',
  placeholder: 'dd/mm/yyyy',
  locale: 'en-GB',
  disabled: false,
})

const modelValue = defineModel<string | undefined>()
const end = defineModel<string | undefined>('end')
const mode = defineModel<DateFilterMode>('mode', { default: 'date' })
const selection = defineModel<DateSelection>('selection', { default: 'single' })
const monthSelection = defineModel<MonthSelection>('monthSelection', { default: 'single' })
const open = shallowRef(false)

const calendarRef = shallowRef<{ goToToday: () => void } | null>(null)

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const MONTH_PATTERN = /^(\d{4})-(\d{2})$/

const isDateRange = computed(() =>
  selection.value === 'range' || selection.value === 'week')

const isMonthRange = computed(() => monthSelection.value === 'multiple')

const singleDate = computed({
  get: () => DATE_PATTERN.test(modelValue.value ?? '')
    ? modelValue.value
    : undefined,
  set: (value: string | undefined) => {
    modelValue.value = value
    end.value = undefined
  },
})

const rangeStart = computed({
  get: () => {
    if (DATE_PATTERN.test(modelValue.value ?? ''))
      return modelValue.value
    if (MONTH_PATTERN.test(modelValue.value ?? ''))
      return modelValue.value
    return undefined
  },
  set: (value: string | undefined) => {
    modelValue.value = value
  },
})

const rangeEnd = computed({
  get: () => {
    if (end.value == null)
      return undefined
    if (DATE_PATTERN.test(end.value) || MONTH_PATTERN.test(end.value))
      return end.value
    return undefined
  },
  set: (value: string | undefined) => {
    end.value = value
  },
})

const monthValue = computed({
  get: () => MONTH_PATTERN.test(modelValue.value ?? '')
    ? modelValue.value
    : undefined,
  set: (value: string | undefined) => {
    modelValue.value = value
    end.value = undefined
  },
})

function formatDay(value: string | undefined) {
  const date = parseDate(value ?? '')

  if (!date)
    return null

  return new Intl.DateTimeFormat(props.locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function formatMonthLabel(value: string | undefined) {
  const date = parseMonth(value ?? '')

  if (!date)
    return null

  return new Intl.DateTimeFormat(props.locale, {
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const selectedLabel = computed(() => {
  if (mode.value === 'date') {
    const startLabel = formatDay(
      DATE_PATTERN.test(modelValue.value ?? '') ? modelValue.value : undefined,
    )

    if (!startLabel)
      return null

    const endLabel = formatDay(
      DATE_PATTERN.test(end.value ?? '') ? end.value : undefined,
    )

    if (endLabel && end.value !== modelValue.value)
      return `${startLabel} – ${endLabel}`

    return startLabel
  }

  const startLabel = formatMonthLabel(
    MONTH_PATTERN.test(modelValue.value ?? '') ? modelValue.value : undefined,
  )

  if (!startLabel)
    return null

  const endLabel = formatMonthLabel(
    MONTH_PATTERN.test(end.value ?? '') ? end.value : undefined,
  )

  if (endLabel && end.value !== modelValue.value)
    return `${startLabel} – ${endLabel}`

  return startLabel
})

const displayValue = computed(() =>
  selectedLabel.value ?? props.triggerLabel ?? props.label)

const selectionDisplay = computed<string | undefined>({
  get: () => selectedLabel.value ?? undefined,
  set: (value) => {
    if (value === undefined || value === '')
      clearSelection()
  },
})

watch(mode, (nextMode) => {
  const value = modelValue.value

  if (nextMode === 'month') {
    if (DATE_PATTERN.test(value ?? ''))
      modelValue.value = value?.slice(0, 7)

    if (DATE_PATTERN.test(end.value ?? ''))
      end.value = end.value?.slice(0, 7)
    else if (!isMonthRange.value)
      end.value = undefined

    selection.value = 'single'
  }
  else if (nextMode === 'date') {
    if (MONTH_PATTERN.test(value ?? ''))
      modelValue.value = `${value}-01`

    if (MONTH_PATTERN.test(end.value ?? ''))
      end.value = `${end.value}-01`
    else if (!isDateRange.value)
      end.value = undefined

    monthSelection.value = 'single'
  }
})

watch(selection, (next) => {
  if (next === 'week')
    snapSelectionToWeeks()
  else if (next === 'single')
    end.value = undefined
})

watch(monthSelection, (next) => {
  if (next === 'single')
    end.value = undefined
})

function snapToWeekStart(value: string | undefined) {
  const date = parseDate(value ?? '')
  return date ? formatDate(startOfWeek(date)) : undefined
}

function snapToWeekEnd(value: string | undefined) {
  const date = parseDate(value ?? '')
  return date ? formatDate(endOfWeek(date)) : undefined
}

function snapSelectionToWeeks() {
  if (!DATE_PATTERN.test(modelValue.value ?? ''))
    return

  modelValue.value = snapToWeekStart(modelValue.value)
  end.value = snapToWeekEnd(end.value ?? modelValue.value)
}

function clearSelection() {
  modelValue.value = undefined
  end.value = undefined
}

function goToToday() {
  const now = new Date()

  if (mode.value === 'date') {
    if (selection.value === 'week') {
      modelValue.value = formatDate(startOfWeek(now))
      end.value = formatDate(endOfWeek(now))
    }
    else {
      modelValue.value = formatDate(now)
      end.value = undefined
    }
  }
  else {
    modelValue.value = formatMonth(now)
    end.value = undefined
  }

  calendarRef.value?.goToToday()
}

const isAtToday = computed(() => {
  const now = new Date()

  if (mode.value === 'date') {
    if (selection.value === 'week') {
      return modelValue.value === formatDate(startOfWeek(now))
        && end.value === formatDate(endOfWeek(now))
    }

    return modelValue.value === formatDate(now) && end.value == null
  }

  return modelValue.value === formatMonth(now) && end.value == null
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :disabled="props.disabled"
        :class="cn('justify-between gap-2', props.class)"
      >
        <span class="i-lucide-calendar-days" data-icon="inline-start" />
        <span>{{ displayValue }}</span>
        <span class="i-lucide-chevron-down" data-icon="inline-end" />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      align="start"
      :class="cn('w-auto p-3', props.contentClass)"
    >
      <div class="flex w-[224px] flex-col gap-2.5">
        <Tabs v-model="mode" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="date" class="w-full px-2 text-xs">
              Date
            </TabsTrigger>
            <TabsTrigger value="month" class="w-full px-2 text-xs">
              Month
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <template v-if="mode === 'date'">
          <Calendar
            v-if="!isDateRange"
            ref="calendarRef"
            v-model="singleDate"
            class="w-full"
          />
          <Calendar
            v-else
            ref="calendarRef"
            range
            :week="selection === 'week'"
            v-model:start="rangeStart"
            v-model:end="rangeEnd"
            class="w-full"
          />

          <Tabs v-model="selection" class="w-full">
            <TabsList class="grid w-full grid-cols-3">
              <TabsTrigger value="single" class="w-full px-1.5 text-xs">
                Single
              </TabsTrigger>
              <TabsTrigger value="range" class="w-full px-1.5 text-xs">
                Range
              </TabsTrigger>
              <TabsTrigger value="week" class="w-full px-1.5 text-xs">
                Week
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <InputClear
            v-model="selectionDisplay"
            readonly
            :clearable="false"
            start-icon="i-lucide-calendar"
            input-class="h-8 text-xs"
            :placeholder="props.placeholder"
          />

          <Button
            v-if="!isAtToday"
            type="button"
            variant="outline"
            class="h-8 w-full text-xs"
            @click="goToToday"
          >
            Reset
          </Button>
        </template>

        <template v-else>
          <Calendar
            v-if="!isMonthRange"
            ref="calendarRef"
            v-model="monthValue"
            month
            class="w-full"
          />
          <Calendar
            v-else
            ref="calendarRef"
            month
            range
            v-model:start="rangeStart"
            v-model:end="rangeEnd"
            class="w-full"
          />

          <Tabs v-model="monthSelection" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="single" class="w-full px-1.5 text-xs">
                Single
              </TabsTrigger>
              <TabsTrigger value="multiple" class="w-full px-1.5 text-xs">
                Multiple
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            v-if="!isAtToday"
            type="button"
            variant="outline"
            class="h-8 w-full text-xs"
            @click="goToToday"
          >
            Reset
          </Button>
        </template>
      </div>
    </PopoverContent>
  </Popover>
</template>
