<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ProgressIndicator, ProgressRoot } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  max?: number
  class?: HTMLAttributes['class']
}>(), {
  max: 100,
})

const modelValue = defineModel<number>()

const pct = computed(() => {
  const value = modelValue.value ?? 0
  return Math.min(100, Math.max(0, (value / props.max) * 100))
})
</script>

<template>
  <ProgressRoot
    :model-value="modelValue ?? 0"
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
