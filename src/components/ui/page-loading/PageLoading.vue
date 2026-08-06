<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

export interface PageLoadingProps {
  label?: string
  description?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<PageLoadingProps>(), {
  label: 'Loading…',
})
</script>

<template>
  <section
    role="status"
    aria-live="polite"
    :class="cn('relative flex min-h-[32rem] w-full items-center justify-center overflow-hidden rounded-xl border bg-background px-6 py-16 text-center', props.class)"
  >
    <div class="pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" aria-hidden="true" />

    <div class="relative z-10 flex flex-col items-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
      <Spinner class="size-8" />
      <p v-if="props.label" class="mt-4 text-sm font-medium">
        {{ props.label }}
      </p>
      <p v-if="props.description" class="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">
        {{ props.description }}
      </p>
    </div>
  </section>
</template>
