<script setup lang="ts">
import type { AccordionItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { AccordionItem } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AccordionItem
    :value="props.value"
    :disabled="props.disabled"
    v-bind="$attrs"
    :class="cn('border-b border-border last:border-b-0 first:rounded-t-lg last:rounded-b-lg', props.class)"
  >
    <slot />
  </AccordionItem>
</template>
