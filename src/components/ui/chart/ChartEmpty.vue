<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  message?: string
  class?: HTMLAttributes['class']
}>(), {
  message: 'No data to display',
})
</script>

<template>
  <div
    :class="cn('flex h-full w-full items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground', props.class)"
  >
    {{ props.message }}
  </div>
</template>
