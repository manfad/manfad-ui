<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { RadioGroupItem } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
  value: string
  disabled?: boolean
  id?: string
}>()
</script>

<template>
  <RadioGroupItem
    v-bind="$attrs"
    :id="props.id"
    :value="props.value"
    :disabled="props.disabled"
    :class="cn(
      'size-4 shrink-0 rounded-full border bg-background shadow-none',
      'border-muted-foreground/40',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-[3px] data-[state=checked]:border-primary',
      props.class,
    )"
  />
</template>
