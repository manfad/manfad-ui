<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    border?: boolean
  }>(),
  {
    border: false,
  },
)
</script>

<template>
  <div :class="cn('flex items-center p-6 pt-0', props.border && 'border-t pt-6', props.class)">
    <slot />
  </div>
</template>
