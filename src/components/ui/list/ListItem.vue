<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  clickable?: boolean
}>()
</script>

<template>
  <li :class="cn('flex items-center gap-3 px-4 py-3 text-sm', props.clickable && 'cursor-pointer transition-colors hover:bg-muted/50', props.class)">
    <slot v-if="$slots.leading" name="leading" />
    <slot />
    <div v-if="$slots.trailing" class="ml-auto flex items-center gap-2">
      <slot name="trailing" />
    </div>
  </li>
</template>
