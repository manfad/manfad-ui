<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { badgeVariants, type BadgeVariants } from '.'

const props = withDefaults(defineProps<{
  variant?: BadgeVariants['variant']
  /** Renders as a button with pointer cursor. */
  clickable?: boolean
  class?: HTMLAttributes['class']
}>(), {
  clickable: false,
})
</script>

<template>
  <component
    :is="props.clickable ? 'button' : 'div'"
    :type="props.clickable ? 'button' : undefined"
    :class="cn(
      badgeVariants({ variant: props.variant }),
      props.clickable && 'cursor-pointer',
      props.class,
    )"
  >
    <slot />
  </component>
</template>
