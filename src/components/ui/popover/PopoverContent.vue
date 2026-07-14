<script setup lang="ts">
import type { PopoverContentEmits, PopoverContentProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { PopoverContent, PopoverPortal, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends PopoverContentProps {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  align: 'center',
  sideOffset: 4,
})
const emits = defineEmits<PopoverContentEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      v-bind="{ ...forwarded, ...$attrs }"
      :class="cn('z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95', props.class)"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
