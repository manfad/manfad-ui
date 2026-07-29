<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span role="status" :class="cn('inline-flex h-5 w-5 text-primary', props.class)">
    <span class="i-lucide-loader-circle h-full w-full animate-spin" />
    <span class="sr-only">Loading</span>
  </span>
</template>
