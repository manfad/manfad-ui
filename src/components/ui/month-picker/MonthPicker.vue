<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'radix-vue'
import { computed, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  placeholder: 'Select month',
  disabled: false,
})

const modelValue = defineModel<string>()
const open = shallowRef(false)

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Parse a `YYYY-MM` value into `{ year, month }` (month is 0-based), or null. */
function parseMonth(value: string | undefined): { year: number, month: number } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value ?? '')

  if (!match)
    return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1

  if (month < 0 || month > 11)
    return null

  return { year, month }
}

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth()

const displayedYear = shallowRef(parseMonth(modelValue.value)?.year ?? currentYear)

const displayValue = computed(() => {
  const parsed = parseMonth(modelValue.value)

  if (!parsed)
    return null

  return `${MONTH_NAMES[parsed.month]} ${parsed.year}`
})

const selected = computed(() => parseMonth(modelValue.value))

watch(open, (value) => {
  if (value)
    displayedYear.value = selected.value?.year ?? currentYear
})

function stepYear(offset: number) {
  displayedYear.value += offset
}

function isSelected(month: number) {
  return !!selected.value
    && selected.value.year === displayedYear.value
    && selected.value.month === month
}

function isCurrent(month: number) {
  return displayedYear.value === currentYear && month === currentMonth
}

function monthClass(month: number) {
  return cn(
    'h-9 w-full rounded-md text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isCurrent(month) && !isSelected(month) && 'font-medium ring-1 ring-inset ring-border',
    isSelected(month) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
  )
}

function selectMonth(month: number) {
  modelValue.value = `${String(displayedYear.value).padStart(4, '0')}-${String(month + 1).padStart(2, '0')}`
  open.value = false
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        type="button"
        :disabled="props.disabled"
        :class="cn('flex h-10 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)"
      >
        <span class="i-lucide-calendar h-4 w-4" />
        <span :class="!displayValue && 'text-muted-foreground'">
          {{ displayValue ?? props.placeholder }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="4"
        align="start"
        class="z-50 w-auto rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none"
      >
        <div class="w-[252px]">
          <div class="relative flex items-center justify-center pb-3">
            <button
              type="button"
              class="absolute left-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              aria-label="Previous year"
              @click="stepYear(-1)"
            >
              <span class="i-lucide-chevron-left h-4 w-4" />
            </button>
            <div class="px-2 py-1 text-sm font-medium">
              {{ displayedYear }}
            </div>
            <button
              type="button"
              class="absolute right-0 inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
              aria-label="Next year"
              @click="stepYear(1)"
            >
              <span class="i-lucide-chevron-right h-4 w-4" />
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="(name, month) in MONTH_NAMES"
              :key="name"
              type="button"
              :class="monthClass(month)"
              :aria-pressed="isSelected(month)"
              @click="selectMonth(month)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
