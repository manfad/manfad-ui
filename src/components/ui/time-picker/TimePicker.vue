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
import { WheelPicker, WheelPickerColumn } from '../wheel-picker'
import { formatCanonical, pad2, parseTime, to12h, to24h } from './utils'

const props = withDefaults(defineProps<{
  format?: '12' | '24'
  minuteStep?: number
  disabled?: boolean
  placeholder?: string
  class?: HTMLAttributes['class']
}>(), {
  format: '12',
  minuteStep: 1,
  disabled: false,
  placeholder: 'Select time',
})

const modelValue = defineModel<string>()
const open = shallowRef(false)

const hourOptions = computed(() =>
  props.format === '24'
    ? Array.from({ length: 24 }, (_, index) => pad2(index))
    : Array.from({ length: 12 }, (_, index) => pad2(index + 1)),
)

const minuteOptions = computed(() => {
  const step = Math.max(1, Math.floor(props.minuteStep))
  const values: string[] = []
  for (let minute = 0; minute < 60; minute += step)
    values.push(pad2(minute))
  return values
})

const periodOptions = ['AM', 'PM']

const selHour = shallowRef('12')
const selMinute = shallowRef('00')
const selPeriod = shallowRef<'AM' | 'PM'>('AM')

// Snap a raw minute to the nearest value on the minuteStep grid, for wheel
// display only (the true model value is preserved until the user interacts).
function nearestMinute(minute: number): string {
  const options = minuteOptions.value
  let best = options[0] ?? '00'
  let bestDistance = Number.POSITIVE_INFINITY
  for (const option of options) {
    const distance = Math.abs(Number(option) - minute)
    if (distance < bestDistance) {
      bestDistance = distance
      best = option
    }
  }
  return best
}

function syncFromModel() {
  const parts = parseTime(modelValue.value ?? '')
  if (!parts) {
    selHour.value = props.format === '24' ? '00' : '12'
    selMinute.value = minuteOptions.value[0] ?? '00'
    selPeriod.value = 'AM'
    return
  }

  if (props.format === '24') {
    selHour.value = pad2(parts.hour24)
  }
  else {
    const { hour12, period } = to12h(parts.hour24)
    selHour.value = pad2(hour12)
    selPeriod.value = period
  }
  selMinute.value = nearestMinute(parts.minute)
}

function commit() {
  const minute = Number(selMinute.value)
  const hour24 = props.format === '24'
    ? Number(selHour.value)
    : to24h(Number(selHour.value), selPeriod.value)
  const next = formatCanonical(hour24, minute)
  if (next !== modelValue.value)
    modelValue.value = next
}

function onHour(value: string | undefined) {
  if (value === undefined)
    return
  // Crossing the 12/01 seam in either direction flips the period (iOS-style);
  // the period column animates to the new value via its model watcher.
  if (props.format === '12') {
    const previous = selHour.value
    if ((previous === '12' && value === '01') || (previous === '01' && value === '12'))
      selPeriod.value = selPeriod.value === 'AM' ? 'PM' : 'AM'
  }
  selHour.value = value
  commit()
}
function onMinute(value: string | undefined) {
  if (value === undefined)
    return
  selMinute.value = value
  commit()
}
function onPeriod(value: string | undefined) {
  if (value === undefined)
    return
  selPeriod.value = value as 'AM' | 'PM'
  commit()
}

watch(
  [modelValue, () => props.format, () => props.minuteStep],
  syncFromModel,
  { immediate: true },
)

const displayValue = computed(() => {
  const parts = parseTime(modelValue.value ?? '')
  if (!parts)
    return null

  if (props.format === '24')
    return formatCanonical(parts.hour24, parts.minute)

  const { hour12, period } = to12h(parts.hour24)
  return `${pad2(hour12)}:${pad2(parts.minute)} ${period}`
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
        <span class="i-lucide-clock h-4 w-4" />
        <span :class="!displayValue && 'text-muted-foreground'">
          {{ displayValue ?? props.placeholder }}
        </span>
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="8"
        align="start"
        class="z-50 w-auto rounded-2xl border bg-popover p-2 text-popover-foreground shadow-md outline-none"
      >
        <WheelPicker class="w-auto gap-1">
          <WheelPickerColumn
            :options="hourOptions"
            :model-value="selHour"
            loop
            aria-label="Hour"
            class="w-14"
            @update:model-value="onHour"
          />
          <WheelPickerColumn
            :options="minuteOptions"
            :model-value="selMinute"
            loop
            aria-label="Minute"
            class="w-14"
            @update:model-value="onMinute"
          />
          <WheelPickerColumn
            v-if="props.format === '12'"
            :options="periodOptions"
            :model-value="selPeriod"
            aria-label="Period"
            class="w-14"
            @update:model-value="onPeriod"
          />
        </WheelPicker>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
