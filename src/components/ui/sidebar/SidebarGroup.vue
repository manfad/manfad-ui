<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <section :class="cn('px-3 py-2', props.class)">
    <h2
      v-if="props.label"
      class="px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground"
    >
      {{ props.label }}
    </h2>
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </section>
</template>
