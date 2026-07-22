<script setup lang="ts">
import type { ToastCloseProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ToastClose } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends ToastCloseProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastClose
    v-bind="delegatedProps"
    :class="cn('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100', props.class)"
    aria-label="Close"
  >
    <slot>
      <span class="i-lucide-x h-4 w-4" />
    </slot>
  </ToastClose>
</template>
