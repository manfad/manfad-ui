<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsTrigger as RadixTabsTrigger } from 'radix-vue'
import { computed, inject } from 'vue'
import { cn } from '@/lib/utils'
import { tabsListContextKey, tabsTriggerVariants } from '.'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  value: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const listContext = inject(tabsListContextKey, computed(() => ({
  variant: 'default' as const,
  square: false,
})))
</script>

<template>
  <RadixTabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    v-bind="$attrs"
    :class="cn(
      tabsTriggerVariants({
        square: listContext.square,
        variant: listContext.variant,
      }),
      props.class,
    )"
  >
    <slot />
  </RadixTabsTrigger>
</template>
