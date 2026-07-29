<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsIndicator, TabsList as RadixTabsList } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <RadixTabsList
    v-bind="$attrs"
    :class="cn('relative inline-flex w-fit items-center rounded-full bg-muted p-[3px] text-muted-foreground', props.class)"
  >
    <TabsIndicator
      class="absolute left-0 top-[3px] h-[calc(100%-6px)] w-[var(--radix-tabs-indicator-size)] translate-x-[var(--radix-tabs-indicator-position)] rounded-full transition-[width,transform] duration-200 ease-out"
    >
      <div class="h-full w-full rounded-full bg-primary shadow-sm" />
    </TabsIndicator>
    <slot />
  </RadixTabsList>
</template>
