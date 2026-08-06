<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsIndicator, TabsList as RadixTabsList } from 'radix-vue'
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import {
  tabsIndicatorVariants,
  tabsListContextKey,
  tabsListVariants,
  type TabsVariant,
} from '.'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  variant?: TabsVariant
  square?: boolean
  class?: HTMLAttributes['class']
}>(), {
  variant: 'default',
  square: false,
})

const isUnderline = computed(() => props.variant === 'underline')

provide(tabsListContextKey, computed(() => ({
  variant: props.variant,
  square: props.square,
})))
</script>

<template>
  <RadixTabsList
    v-bind="$attrs"
    :class="cn(tabsListVariants({ variant: props.variant, square: props.square }), props.class)"
  >
    <TabsIndicator
      :class="cn(
        'absolute left-0 transition-[width,transform] duration-200 ease-out',
        isUnderline
          ? 'bottom-0 top-auto h-0.5 w-[var(--radix-tabs-indicator-size)] translate-x-[var(--radix-tabs-indicator-position)]'
          : 'top-[3px] h-[calc(100%-6px)] w-[var(--radix-tabs-indicator-size)] translate-x-[var(--radix-tabs-indicator-position)]',
        !isUnderline && (props.square ? 'rounded-md' : 'rounded-full'),
      )"
    >
      <div :class="cn(tabsIndicatorVariants({ square: props.square, variant: props.variant }))" />
    </TabsIndicator>
    <slot />
  </RadixTabsList>
</template>
