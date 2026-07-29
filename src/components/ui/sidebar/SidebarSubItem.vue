<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  active?: boolean
  as?: string
  class?: HTMLAttributes['class']
}>(), {
  active: false,
  as: 'a',
})
</script>

<template>
  <component
    :is="props.as"
    v-bind="$attrs"
    :class="cn(
      'flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
      props.active && 'bg-sidebar-accent text-sidebar-accent-foreground',
      props.class,
    )"
  >
    <slot name="icon" />
    <slot />
  </component>
</template>
