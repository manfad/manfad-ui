<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <ul :class="cn('w-full divide-y rounded-md border', props.class)">
    <slot />
  </ul>
</template>
