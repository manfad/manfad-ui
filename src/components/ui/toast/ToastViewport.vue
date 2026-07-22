<script setup lang="ts">
import type { ToastViewportProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ToastViewport } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends ToastViewportProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <ToastViewport
    v-bind="delegatedProps"
    :class="cn('fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:max-w-[420px]', props.class)"
  />
</template>
