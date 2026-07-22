<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsContent as RadixTabsContent } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  value: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <RadixTabsContent
    :value="props.value"
    v-bind="$attrs"
    :class="cn('mt-2 focus-visible:outline-none', props.class)"
  >
    <slot />
  </RadixTabsContent>
</template>
