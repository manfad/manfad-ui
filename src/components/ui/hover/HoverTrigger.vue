<script setup lang="ts">
import type { HoverCardTriggerProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { HoverCardTrigger } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props extends HoverCardTriggerProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})
</script>

<template>
  <HoverCardTrigger
    v-bind="delegatedProps"
    :class="cn('cursor-help underline decoration-dotted decoration-muted-foreground/70 underline-offset-4', props.class)"
  >
    <slot />
  </HoverCardTrigger>
</template>
