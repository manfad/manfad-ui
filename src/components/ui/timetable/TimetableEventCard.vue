<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { TimetableEvent } from './Timetable.vue'
import { cn } from '@/lib/utils'

defineProps<{
  event: TimetableEvent
  timeLabel: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <article
    :class="cn(
      'h-full overflow-hidden rounded-md border bg-background px-2 py-1.5 text-xs shadow-sm',
      'transition-colors hover:bg-accent/40',
      event.class,
      $props.class,
    )"
    :aria-label="`${event.title}, ${timeLabel}${event.subtitle ? `, ${event.subtitle}` : ''}`"
  >
    <slot>
      <p class="truncate font-semibold leading-tight text-foreground">
        {{ event.title }}
      </p>
      <p class="truncate leading-tight text-muted-foreground">
        {{ timeLabel }}
      </p>
      <p v-if="event.subtitle" class="truncate leading-tight text-muted-foreground">
        {{ event.subtitle }}
      </p>
    </slot>
  </article>
</template>
