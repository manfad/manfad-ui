<script setup lang="ts">
import type { AccordionContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { AccordionContent } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AccordionContent
    v-bind="$attrs"
    class="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  >
    <div :class="cn('px-4 py-3', props.class)">
      <slot />
    </div>
  </AccordionContent>
</template>
