<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<boolean>()
</script>

<template>
  <CheckboxRoot
    v-model:checked="modelValue"
    v-bind="$attrs"
    :class="cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground', props.class)"
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <span class="i-lucide-check h-3.5 w-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
