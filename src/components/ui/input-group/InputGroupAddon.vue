<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  side?: 'leading' | 'trailing'
}>(), {
  side: 'leading',
})
</script>

<template>
  <div :class="cn('flex items-center px-3 text-sm text-muted-foreground', props.side === 'leading' ? 'pr-0' : 'pl-0', props.class)">
    <slot />
  </div>
</template>
