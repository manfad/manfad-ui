<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label as LabelPrimitive } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <LabelPrimitive
    v-bind="$attrs"
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
  </LabelPrimitive>
</template>
