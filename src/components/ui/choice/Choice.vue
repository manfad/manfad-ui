<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, watch } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Radio, RadioGroup } from '@/components/ui/radio'
import { cn } from '@/lib/utils'

export type ChoiceVariant = 'checkbox' | 'radio'

export interface ChoiceOption {
  label: string
  value: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  options: ChoiceOption[]
  label?: string
  variant?: ChoiceVariant
  disabled?: boolean
  /** Renders a divider line between each option. */
  separator?: boolean
  class?: HTMLAttributes['class']
  itemClass?: HTMLAttributes['class']
}>(), {
  variant: 'checkbox',
  disabled: false,
  separator: false,
})

function optionClasses(option: ChoiceOption) {
  const isDisabled = props.disabled || option.disabled

  return cn(
    'flex cursor-pointer items-center gap-2 text-sm',
    props.separator && 'py-2.5',
    props.itemClass,
    isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent hover:text-inherit',
  )
}

const modelValue = defineModel<string[]>({ default: () => [] })

const isRadio = computed(() => props.variant === 'radio')

const rootClass = computed(() => cn(
  isRadio.value ? 'min-w-0' : 'flex min-w-0 flex-col gap-3',
  props.separator && 'gap-0 [&>label+label]:border-t [&>label+label]:border-border',
  props.class,
))

const legendClass = 'mb-3 block w-full text-sm font-semibold'

const radioValue = computed({
  get: () => modelValue.value[0],
  set: (value: string | undefined) => {
    modelValue.value = value ? [value] : []
  },
})

watch(isRadio, (radio) => {
  if (radio && modelValue.value.length > 1)
    modelValue.value = modelValue.value.slice(0, 1)
})

function isSelected(value: string) {
  return modelValue.value.includes(value)
}

function updateOption(value: string, checked: boolean) {
  modelValue.value = checked
    ? [...new Set([...modelValue.value, value])]
    : modelValue.value.filter(selectedValue => selectedValue !== value)
}
</script>

<template>
  <RadioGroup
    v-if="isRadio"
    v-model="radioValue"
    as="fieldset"
    :disabled="props.disabled"
    :class="rootClass"
  >
    <legend
      v-if="props.label"
      :class="legendClass"
    >
      {{ props.label }}
    </legend>

    <label
      v-for="option in props.options"
      :key="option.value"
      :class="optionClasses(option)"
    >
      <Radio
        :value="option.value"
        :disabled="props.disabled || option.disabled"
        :aria-label="option.label"
      />
      <span>{{ option.label }}</span>
    </label>
  </RadioGroup>

  <fieldset
    v-else
    :disabled="props.disabled"
    :class="rootClass"
  >
    <legend
      v-if="props.label"
      :class="legendClass"
    >
      {{ props.label }}
    </legend>

    <label
      v-for="option in props.options"
      :key="option.value"
      :class="optionClasses(option)"
    >
      <Checkbox
        :model-value="isSelected(option.value)"
        :disabled="props.disabled || option.disabled"
        :aria-label="option.label"
        @update:model-value="updateOption(option.value, $event ?? false)"
      />
      <span>{{ option.label }}</span>
    </label>
  </fieldset>
</template>
