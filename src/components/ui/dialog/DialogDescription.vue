<script setup lang="ts">
import type { DialogDescriptionProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { DialogDescription } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props extends DialogDescriptionProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()
</script>

<template>
  <DialogDescription
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :class="cn('text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
