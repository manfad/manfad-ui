<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
  indeterminate?: boolean
}>()

const modelValue = defineModel<boolean>()

const checkedState = computed<boolean | 'indeterminate'>(() =>
  props.indeterminate ? 'indeterminate' : (modelValue.value ?? false),
)

function onUpdate(value: boolean | 'indeterminate') {
  modelValue.value = value === true
}
</script>

<template>
  <CheckboxRoot
    :checked="checkedState"
    v-bind="$attrs"
    :class="cn('peer h-4 w-4 shrink-0 rounded-sm border border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground', props.class)"
    @update:checked="onUpdate"
  >
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <span :class="checkedState === 'indeterminate' ? 'i-lucide-minus' : 'i-lucide-check'" class="h-3.5 w-3.5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
