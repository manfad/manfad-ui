<script setup lang="ts">
import type { DropdownMenuLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { DropdownMenuLabel } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends DropdownMenuLabelProps {
  class?: HTMLAttributes['class']
  inset?: boolean
}

const props = defineProps<Props>()
const delegatedProps = computed(() => {
  const { class: _, inset: __, ...delegated } = props
  return delegated
})
</script>

<template>
  <DropdownMenuLabel
    v-bind="{ ...delegatedProps, ...$attrs }"
    :class="cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', inset && 'pl-8', props.class)"
  >
    <slot />
  </DropdownMenuLabel>
</template>
