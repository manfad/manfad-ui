<script setup lang="ts">
import type { SelectLabelProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { SelectLabel } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends SelectLabelProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <SelectLabel
    v-bind="{ ...delegatedProps, ...$attrs }"
    :class="cn('py-1.5 pl-8 pr-2 text-sm font-semibold', props.class)"
  >
    <slot />
  </SelectLabel>
</template>
