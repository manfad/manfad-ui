<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  orientation?: 'vertical' | 'horizontal' | 'both'
}

const props = withDefaults(defineProps<Props>(), {
  orientation: 'vertical',
})

const overflowClass = computed(() => {
  switch (props.orientation) {
    case 'horizontal':
      return 'overflow-x-auto overflow-y-hidden'
    case 'both':
      return 'overflow-auto'
    case 'vertical':
    default:
      return 'overflow-y-auto overflow-x-hidden'
  }
})
</script>

<template>
  <div :class="cn('scroll-area', overflowClass, props.class)">
    <slot />
  </div>
</template>

<style scoped>
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}

.scroll-area::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-corner {
  background: transparent;
}

.scroll-area::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 9999px;
  border: 2px solid transparent;
  background-clip: content-box;
}

.scroll-area::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.4);
  background-clip: content-box;
}
</style>
