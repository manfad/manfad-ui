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
import { parseDate } from './utils'

const props = withDefaults(defineProps<{
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  placeholder: 'Pick a date',
  disabled: false,
})

const modelValue = defineModel<string>()
const open = shallowRef(false)

const displayValue = computed(() => {
  const date = parseDate(modelValue.value ?? '')

  if (!date)
    return null

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
})

watch(modelValue, (value, previousValue) => {
  if (value !== previousValue)
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
        <Calendar v-model="modelValue" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
