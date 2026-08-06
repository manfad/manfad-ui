<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'radix-vue'
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  /** Visual style. `bar` is a linear track; `circle` is a ring. */
  variant?: 'bar' | 'circle'
  max?: number
  /**
   * Circle diameter in pixels.
   * @default 40
   */
  size?: number
  /**
   * Circle stroke width in pixels.
   * @default 3
   */
  strokeWidth?: number
  class?: HTMLAttributes['class']
}>(), {
  variant: 'bar',
  max: 100,
  size: 40,
  strokeWidth: 3,
})

const modelValue = defineModel<number>()
const slots = useSlots()

defineSlots<{
  default: (props: { value: number, percent: number }) => unknown
}>()

const pct = computed(() => {
  const value = modelValue.value ?? 0
  if (props.max <= 0)
    return 0
  return Math.min(100, Math.max(0, (value / props.max) * 100))
})

const radius = computed(() => Math.max(0, (props.size - props.strokeWidth) / 2))
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value - (pct.value / 100) * circumference.value)
const center = computed(() => props.size / 2)
const value = computed(() => modelValue.value ?? 0)
</script>

<template>
  <div
    v-if="props.variant === 'circle'"
    :class="cn('relative inline-flex shrink-0 items-center justify-center', props.class)"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
  >
    <ProgressRoot
      :model-value="value"
      :max="props.max"
      v-bind="$attrs"
      class="size-full"
    >
      <svg
        :width="props.size"
        :height="props.size"
        :viewBox="`0 0 ${props.size} ${props.size}`"
        class="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          class="stroke-secondary"
          :stroke-width="props.strokeWidth"
        />
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          class="stroke-primary transition-[stroke-dashoffset] duration-300 ease-out"
          :stroke-width="props.strokeWidth"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
        />
      </svg>
    </ProgressRoot>
    <span
      v-if="slots.default"
      class="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-medium tabular-nums text-foreground"
    >
      <slot :value="value" :percent="pct" />
    </span>
  </div>

  <ProgressRoot
    v-else
    :model-value="value"
    :max="props.max"
    v-bind="$attrs"
    :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-secondary', props.class)"
  >
    <ProgressIndicator
      class="h-full w-full flex-1 bg-primary transition-transform duration-300 ease-out"
      :style="`transform: translateX(-${100 - pct}%)`"
    />
  </ProgressRoot>
</template>
