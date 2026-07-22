<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  /** UnoCSS icon class rendered inside the field, e.g. 'i-lucide-search'. */
  startIcon?: string
  endIcon?: string
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string | number>()
</script>

<template>
  <div class="relative w-full">
    <span
      v-if="props.startIcon || $slots.start"
      class="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground"
    >
      <slot name="start">
        <span :class="props.startIcon" class="h-4 w-4" aria-hidden="true" />
      </slot>
    </span>
    <Input
      v-model="modelValue"
      v-bind="$attrs"
      :class="cn(
        (props.startIcon || $slots.start) && 'pl-9',
        (props.endIcon || $slots.end) && 'pr-9',
        props.class,
      )"
    />
    <span
      v-if="props.endIcon || $slots.end"
      class="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground"
    >
      <slot name="end">
        <span :class="props.endIcon" class="h-4 w-4" aria-hidden="true" />
      </slot>
    </span>
  </div>
</template>
