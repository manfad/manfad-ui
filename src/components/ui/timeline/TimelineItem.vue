<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, inject, useSlots } from 'vue'
import { timelineOrientationKey } from './Timeline.vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title?: string
  time?: string
  icon?: string
  /** Shorthand for state="active". */
  active?: boolean
  /** done → filled marker; active → filled marker with a soft halo. */
  state?: 'done' | 'active' | 'upcoming'
  class?: HTMLAttributes['class']
}>()

const slots = useSlots()
const orientation = inject(timelineOrientationKey, computed(() => 'vertical' as const))
const horizontal = computed(() => orientation.value === 'horizontal')
const state = computed(() => props.state ?? (props.active ? 'active' : 'upcoming'))

const DOT_STATE = {
  done: 'bg-primary',
  active: 'bg-primary ring-4 ring-primary/20',
  upcoming: 'bg-border',
} as const

const iconStateClass = computed(() => {
  if (state.value === 'upcoming')
    return 'border border-border bg-background text-muted-foreground'
  if (state.value === 'active')
    return 'bg-primary text-primary-foreground ring-4 ring-primary/20'
  return 'bg-primary text-primary-foreground'
})

const railClass = computed(() =>
  state.value === 'done' ? 'bg-primary' : 'bg-border',
)
</script>

<template>
  <!--
    Rail grows between markers with negative margin so it overlaps each marker
    center. Filled markers (dots + done/active icons) sit on top so the stroke
    reads as one continuous line.
  -->
  <li
    v-if="horizontal"
    :class="cn('relative min-w-0 flex-1 last:flex-none', props.class)"
  >
    <div class="flex h-6 w-full items-center">
      <span class="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center">
        <span
          v-if="props.icon"
          :class="cn(
            'flex h-6 w-6 items-center justify-center rounded-full',
            iconStateClass,
          )"
        >
          <span :class="cn('h-3.5 w-3.5', props.icon)" aria-hidden="true" />
        </span>
        <span
          v-else
          :class="cn('h-2.5 w-2.5 rounded-full', DOT_STATE[state])"
        />
      </span>
      <span
        class="manfad-timeline-rail relative z-0 h-0.5 min-w-2 flex-1 -mx-3"
        :class="railClass"
        aria-hidden="true"
      />
    </div>
    <div class="mt-2 pr-4">
      <p v-if="props.time" class="text-xs text-muted-foreground">{{ props.time }}</p>
      <p v-if="props.title" class="text-sm font-medium">{{ props.title }}</p>
      <div v-if="slots.default" class="text-sm text-muted-foreground">
        <slot />
      </div>
    </div>
  </li>

  <li
    v-else
    :class="cn('flex gap-3', props.class)"
  >
    <div class="flex w-6 shrink-0 flex-col items-center self-stretch">
      <span class="relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center">
        <span
          v-if="props.icon"
          :class="cn(
            'flex h-6 w-6 items-center justify-center rounded-full',
            iconStateClass,
          )"
        >
          <span :class="cn('h-3.5 w-3.5', props.icon)" aria-hidden="true" />
        </span>
        <span
          v-else
          :class="cn('h-2.5 w-2.5 rounded-full', DOT_STATE[state])"
        />
      </span>
      <span
        class="manfad-timeline-rail relative z-0 w-0.5 min-h-6 flex-1 -my-3"
        :class="railClass"
        aria-hidden="true"
      />
    </div>
    <div class="min-w-0 flex-1 pb-6 pt-0.5">
      <p v-if="props.time" class="text-xs text-muted-foreground">{{ props.time }}</p>
      <p v-if="props.title" class="text-sm font-medium">{{ props.title }}</p>
      <div v-if="slots.default" class="text-sm text-muted-foreground">
        <slot />
      </div>
    </div>
  </li>
</template>

<style scoped>
li:last-child > :first-child > .manfad-timeline-rail {
  display: none;
}

li:last-child > :last-child {
  padding-bottom: 0;
  padding-right: 0;
}
</style>
