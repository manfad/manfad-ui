<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject } from 'vue'
import { timelineOrientationKey } from './Timeline.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title?: string
  time?: string
  icon?: string
  /** Shorthand for state="active". */
  active?: boolean
  /** done → filled dot; active → filled dot with a background-colored halo. */
  state?: 'done' | 'active' | 'upcoming'
  class?: HTMLAttributes['class']
}>()

const orientation = inject(timelineOrientationKey, computed(() => 'vertical' as const))
const horizontal = computed(() => orientation.value === 'horizontal')
const state = computed(() => props.state ?? (props.active ? 'active' : 'upcoming'))

const DOT_STATE = {
  done: 'bg-primary',
  active: 'bg-primary ring-4 ring-background',
  upcoming: 'bg-border',
} as const
</script>

<template>
  <li :class="cn('relative', horizontal ? 'min-w-0 flex-1 pr-4 pt-9 last:flex-none last:pr-0' : 'pl-6', props.class)">
    <!-- Rail segment running toward the NEXT item; the last item draws none,
         so the line starts at the first dot and ends at the last. -->
    <span
      class="yf-timeline-rail absolute"
      :class="[
        horizontal ? 'left-4 right-0 top-3 h-px' : '-bottom-8 left-0 top-3 w-px -translate-x-1/2',
        state === 'done' ? 'bg-primary' : 'bg-border',
      ]"
      aria-hidden="true"
    />

    <span
      v-if="props.icon"
      :class="cn(
        'absolute flex h-6 w-6 items-center justify-center rounded-full border bg-background',
        horizontal ? 'left-0 top-0' : 'left-0 top-0 -translate-x-1/2',
        state !== 'upcoming' && 'border-primary',
      )"
    >
      <span
        :class="cn('h-3.5 w-3.5', state === 'upcoming' ? 'text-muted-foreground' : 'text-primary', props.icon)"
        aria-hidden="true"
      />
    </span>
    <span
      v-else
      :class="cn(
        'absolute h-2.5 w-2.5 rounded-full',
        horizontal ? 'left-[7px] top-[7px]' : 'left-0 top-1.5 -translate-x-1/2',
        DOT_STATE[state],
      )"
    />

    <p v-if="props.time" class="text-xs text-muted-foreground">{{ props.time }}</p>
    <p v-if="props.title" class="text-sm font-medium">{{ props.title }}</p>
    <div class="text-sm text-muted-foreground">
      <slot />
    </div>
  </li>
</template>

<style scoped>
li:last-child > .yf-timeline-rail {
  display: none;
}
</style>
