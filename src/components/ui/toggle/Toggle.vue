<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Toggle as ToggleRoot } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  /**
   * default: light at rest, inverts to solid dark when pressed.
   * inverted: solid dark at rest, inverts to light when pressed.
   */
  variant?: 'default' | 'inverted'
  class?: HTMLAttributes['class']
}>(), {
  variant: 'default',
})

const pressed = defineModel<boolean>({ default: false })

// Hover styles are scoped per pressed state: an unscoped hover:bg-* keeps
// applying after the press and fights the state colors (dark-on-dark).
const variantClass = computed(() =>
  props.variant === 'inverted'
    ? 'border-primary bg-primary text-primary-foreground data-[state=off]:hover:bg-primary/90 data-[state=on]:border-input data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:hover:bg-accent data-[state=on]:hover:text-accent-foreground'
    : 'border-input bg-background text-foreground data-[state=off]:hover:bg-accent data-[state=off]:hover:text-accent-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary/90',
)
</script>

<template>
  <ToggleRoot
    v-model:pressed="pressed"
    v-bind="$attrs"
    :class="cn('inline-flex h-10 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50', variantClass, props.class)"
  >
    <slot />
  </ToggleRoot>
</template>
