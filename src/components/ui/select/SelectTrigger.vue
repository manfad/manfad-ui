<script setup lang="ts">
import type { SelectTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { SelectTrigger } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends SelectTriggerProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <SelectTrigger
    v-bind="{ ...delegatedProps, ...$attrs }"
    :class="cn('flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate', props.class)"
  >
    <slot />
    <span class="i-lucide-chevron-down h-4 w-4 opacity-50" aria-hidden="true" />
  </SelectTrigger>
</template>
