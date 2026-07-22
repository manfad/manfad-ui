<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import {
  WHEEL_PICKER_INJECTION_KEY,
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_VISIBLE_COUNT,
} from './context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  itemHeight?: number
  visibleCount?: number
  class?: HTMLAttributes['class']
}>(), {
  itemHeight: WHEEL_PICKER_ITEM_HEIGHT,
  visibleCount: WHEEL_PICKER_VISIBLE_COUNT,
})

const itemHeight = computed(() => props.itemHeight)
const visibleCount = computed(() => props.visibleCount)

provide(WHEEL_PICKER_INJECTION_KEY, { itemHeight, visibleCount })

const wrapperStyle = computed<CSSProperties>(() => ({
  height: `${itemHeight.value * visibleCount.value}px`,
}))

const bandStyle = computed<CSSProperties>(() => ({
  height: `${itemHeight.value}px`,
}))
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('relative flex items-stretch', props.class)"
    :style="wrapperStyle"
  >
    <div
      class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full bg-muted"
      :style="bandStyle"
      aria-hidden="true"
    />
    <div class="relative flex w-full items-stretch">
      <slot />
    </div>
  </div>
</template>
