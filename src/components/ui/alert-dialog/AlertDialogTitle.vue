<script setup lang="ts">
import type { AlertDialogTitleProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { AlertDialogTitle } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends AlertDialogTitleProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <AlertDialogTitle
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
