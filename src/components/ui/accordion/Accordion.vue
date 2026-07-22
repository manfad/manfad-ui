<script setup lang="ts">
import type { AccordionRootEmits, AccordionRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { AccordionRoot, useForwardPropsEmits } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<AccordionRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<AccordionRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <AccordionRoot
    v-bind="{ ...forwarded, ...$attrs }"
    :class="cn('rounded-lg border', props.class)"
  >
    <slot />
  </AccordionRoot>
</template>
