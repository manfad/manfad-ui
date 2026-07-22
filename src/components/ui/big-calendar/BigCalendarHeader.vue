<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  label: string
  month: number
  year: number
  locale?: string
}>(), {
  locale: 'en',
})

const emit = defineEmits<{
  previous: []
  next: []
  today: []
  pick: [year: number, month: number]
}>()

const pickerOpen = shallowRef(false)
const pickerYear = shallowRef(props.year)

// Re-anchor the picker to the displayed month each time it opens.
watch(pickerOpen, (open) => {
  if (open)
    pickerYear.value = props.year
})

const monthNames = computed(() => {
  const formatter = new Intl.DateTimeFormat(props.locale, { month: 'short' })
  return Array.from({ length: 12 }, (_, month) => formatter.format(new Date(2024, month, 1)))
})

const thisMonth = new Date().getMonth()
const thisYear = new Date().getFullYear()

function pickMonth(month: number): void {
  pickerOpen.value = false
  emit('pick', pickerYear.value, month)
}
</script>

<template>
  <div class="flex items-center justify-between gap-4 border-b px-4 py-3">
    <Popover v-model:open="pickerOpen">
      <PopoverTrigger as-child>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-base font-semibold tracking-tight transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Pick month"
        >
          {{ props.label }}
          <span class="i-lucide-chevron-down h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" class="w-64 p-3">
        <div class="mb-2 flex items-center justify-between">
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous year"
            @click="pickerYear -= 1"
          >
            <span class="i-lucide-chevron-left h-4 w-4" aria-hidden="true" />
          </button>
          <span class="text-sm font-medium">{{ pickerYear }}</span>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next year"
            @click="pickerYear += 1"
          >
            <span class="i-lucide-chevron-right h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div class="grid grid-cols-3 gap-1">
          <button
            v-for="(name, month) in monthNames"
            :key="name"
            type="button"
            :class="cn(
              'h-9 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              month === props.month && pickerYear === props.year
                ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground'
                : month === thisMonth && pickerYear === thisYear && 'font-medium ring-1 ring-inset ring-border',
            )"
            @click="pickMonth(month)"
          >
            {{ name }}
          </button>
        </div>
      </PopoverContent>
    </Popover>

    <div class="flex items-center gap-1">
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Previous month"
        @click="$emit('previous')"
      >
        <span class="i-lucide-chevron-left h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="$emit('today')"
      >
        Today
      </button>
      <button
        type="button"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Next month"
        @click="$emit('next')"
      >
        <span class="i-lucide-chevron-right h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
