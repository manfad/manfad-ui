<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { RadioGroupRoot } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
  disabled?: boolean
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <RadioGroupRoot
    v-model="modelValue"
    v-bind="$attrs"
    :disabled="props.disabled"
    :class="cn('grid gap-3', props.class)"
  >
    <slot />
  </RadioGroupRoot>
</template>
