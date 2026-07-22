<script setup lang="ts">
import type { AccordionTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { AccordionHeader, AccordionTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      v-bind="$attrs"
      :class="cn('group flex flex-1 items-center justify-between border-b border-transparent px-4 py-3 text-sm font-medium outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 data-[state=open]:border-border', props.class)"
    >
      <slot />
      <span
        class="i-lucide-chevron-down ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
      />
    </AccordionTrigger>
  </AccordionHeader>
</template>
