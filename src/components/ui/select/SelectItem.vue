<script setup lang="ts">
import type { SelectItemProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { SelectItem, SelectItemIndicator, SelectItemText } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends SelectItemProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <SelectItem
    v-bind="{ ...delegatedProps, ...$attrs }"
    :class="cn('relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50', props.class)"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <span class="i-lucide-check h-4 w-4" aria-hidden="true" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
