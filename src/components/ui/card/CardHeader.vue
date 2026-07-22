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
  <div :class="cn('flex flex-col space-y-1.5 p-6', props.border && 'border-b', props.class)">
    <slot />
  </div>
</template>
