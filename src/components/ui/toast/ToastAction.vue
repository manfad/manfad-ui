<script setup lang="ts">
import type { ToastActionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ToastAction } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends ToastActionProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastAction
    v-bind="delegatedProps"
    :class="cn('inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', props.class)"
  >
    <slot />
  </ToastAction>
</template>
