<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsTrigger as RadixTabsTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <RadixTabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    v-bind="$attrs"
    :class="cn('relative z-10 inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground', props.class)"
  >
    <slot />
  </RadixTabsTrigger>
</template>
