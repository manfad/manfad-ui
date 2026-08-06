<script lang="ts">
import type { ComputedRef, InjectionKey } from 'vue'

export type TimelineOrientation = 'vertical' | 'horizontal'

export const timelineOrientationKey: InjectionKey<ComputedRef<TimelineOrientation>> = Symbol('manfad-timeline-orientation')
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  orientation?: TimelineOrientation
  class?: HTMLAttributes['class']
}>(), {
  orientation: 'vertical',
})

provide(timelineOrientationKey, computed(() => props.orientation))
</script>

<template>
  <ol
    :class="cn(
      props.orientation === 'horizontal' ? 'flex' : 'flex flex-col',
      props.class,
    )"
  >
    <slot />
  </ol>
</template>
