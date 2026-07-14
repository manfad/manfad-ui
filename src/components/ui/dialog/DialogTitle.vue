<script setup lang="ts">
import type { DialogTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { DialogTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends DialogTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <DialogTitle
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
