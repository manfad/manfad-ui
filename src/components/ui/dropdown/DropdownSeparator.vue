<script setup lang="ts">
import type { DropdownMenuSeparatorProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { DropdownMenuSeparator } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends DropdownMenuSeparatorProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <DropdownMenuSeparator
    v-bind="{ ...delegatedProps, ...$attrs }"
    :class="cn('-mx-1 my-1 h-px bg-border', props.class)"
  />
</template>
