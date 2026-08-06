<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  startIcon?: string
  clearLabel?: string
  disabled?: boolean
  clearable?: boolean
  class?: HTMLAttributes['class']
  inputClass?: HTMLAttributes['class']
}>(), {
  clearLabel: 'Clear input',
  disabled: false,
  clearable: true,
})

const emit = defineEmits<{
  clear: []
}>()

const modelValue = defineModel<string | number | undefined>()

const hasValue = computed(() =>
  modelValue.value !== undefined
  && modelValue.value !== '',
)

function clear() {
  if (props.disabled)
    return

  modelValue.value = undefined
  emit('clear')
}
</script>

<template>
  <div :class="cn('relative w-full', props.class)">
    <span
      v-if="props.startIcon || $slots.start"
      class="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center text-muted-foreground"
    >
      <slot name="start">
        <span :class="props.startIcon" aria-hidden="true" />
      </slot>
    </span>

    <Input
      v-model="modelValue"
      v-bind="$attrs"
      :disabled="props.disabled"
      :title="hasValue ? String(modelValue) : undefined"
      :class="cn(
        'truncate',
        props.inputClass,
        (props.startIcon || $slots.start) && 'pl-9',
        props.clearable && hasValue && 'pr-11',
      )"
    />

    <Button
      v-if="props.clearable && hasValue"
      type="button"
      variant="ghost"
      size="icon"
      class="absolute right-1 top-1/2 size-6 -translate-y-1/2"
      :disabled="props.disabled"
      :aria-label="props.clearLabel"
      @mousedown.prevent
      @click="clear"
    >
      <span class="i-lucide-x text-muted-foreground" data-icon="inline-start" />
    </Button>
  </div>
</template>
