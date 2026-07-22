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
import Calendar from './Calendar.vue'
import { parseDate, type RestDay } from './utils'

const props = withDefaults(defineProps<{
  placeholder?: string
  disabled?: boolean
  range?: boolean
  restday?: RestDay[]
  exclude?: string | string[]
  restdayClass?: HTMLAttributes['class']
  excludeClass?: HTMLAttributes['class']
  class?: HTMLAttributes['class']
}>(), {
  placeholder: 'Pick a date',
  disabled: false,
  range: false,
})

const modelValue = defineModel<string>()
const rangeStart = defineModel<string>('start')
const rangeEnd = defineModel<string>('end')
const open = shallowRef(false)

function formatValue(value: string | undefined): string | null {
  const date = parseDate(value ?? '')

  if (!date)
    return null

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

const displayValue = computed(() => {
  if (!props.range)
    return formatValue(modelValue.value)

  const start = formatValue(rangeStart.value)

  if (!start)
    return null

  const end = formatValue(rangeEnd.value)

  return end ? `${start} – ${end}` : `${start} – …`
})

watch(modelValue, (value, previousValue) => {
  if (!props.range && value !== previousValue)
    open.value = false
})

watch(rangeEnd, (value, previousValue) => {
  if (props.range && value && value !== previousValue)
    open.value = false
})
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
        <Calendar
          v-model="modelValue"
          v-model:start="rangeStart"
          v-model:end="rangeEnd"
          :range="props.range"
          :restday="props.restday"
          :exclude="props.exclude"
          :restday-class="props.restdayClass"
          :exclude-class="props.excludeClass"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
