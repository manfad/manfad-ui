<script setup lang="ts">
import type { ToastRootEmits, ToastRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { ToastRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { toastVariants, type ToastVariants } from '.'

interface Props extends ToastRootProps {
  class?: HTMLAttributes['class']
  variant?: ToastVariants['variant']
}

const props = defineProps<Props>()
const emits = defineEmits<ToastRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, variant: __, ...delegated } = props
  return delegated
})
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot
    v-bind="forwarded"
    :class="cn(toastVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </ToastRoot>
</template>
