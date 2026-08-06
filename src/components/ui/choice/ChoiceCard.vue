<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, watch } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Radio, RadioGroup } from '@/components/ui/radio'
import { cn } from '@/lib/utils'
import type { ChoiceOption, ChoiceVariant } from './Choice.vue'

export type ChoiceCardPosition = 'start' | 'end'

export interface ChoiceCardOption extends ChoiceOption {
  description?: string
}

const props = withDefaults(defineProps<{
  options: ChoiceCardOption[]
  label?: string
  variant?: ChoiceVariant
  position?: ChoiceCardPosition
  indicator?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
  itemClass?: HTMLAttributes['class']
}>(), {
  variant: 'radio',
  position: 'end',
  indicator: false,
  disabled: false,
})

const modelValue = defineModel<string[]>({ default: () => [] })

const isRadio = computed(() => props.variant === 'radio')

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
  if (props.disabled)
    return

  if (isRadio.value) {
    if (checked)
      modelValue.value = [value]
    return
  }

  modelValue.value = checked
    ? [...new Set([...modelValue.value, value])]
    : modelValue.value.filter(selectedValue => selectedValue !== value)
}

function selectOption(option: ChoiceCardOption) {
  if (props.disabled || option.disabled)
    return

  if (isRadio.value) {
    modelValue.value = [option.value]
    return
  }

  updateOption(option.value, !isSelected(option.value))
}

function itemClasses(option: ChoiceCardOption) {
  const selected = isSelected(option.value)

  return cn(
    'flex w-full cursor-pointer rounded-lg border p-4 text-left shadow-none transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    props.indicator
      ? 'flex-row items-start gap-3'
      : 'flex-col items-start gap-1',
    selected
      ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90'
      : 'border-border bg-background hover:bg-muted/50',
    (props.disabled || option.disabled) && 'cursor-not-allowed opacity-50 hover:bg-background',
    props.itemClass,
  )
}

function descriptionClasses(option: ChoiceCardOption) {
  return cn(
    'text-sm',
    isSelected(option.value) ? 'text-primary-foreground/80' : 'text-muted-foreground',
  )
}

function controlClasses(option: ChoiceCardOption) {
  const selected = isSelected(option.value)

  return cn(
    'mt-0.5 shrink-0',
    !props.indicator && 'sr-only',
    props.indicator && props.position === 'end' && 'order-2',
    selected && isRadio.value && 'border-primary-foreground data-[state=checked]:border-primary-foreground',
    selected && !isRadio.value && 'border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary',
  )
}

function contentClasses() {
  return cn(
    'flex min-w-0 flex-1 flex-col gap-1',
    props.indicator && props.position === 'end' && 'order-1',
  )
}
</script>

<template>
  <RadioGroup
    v-if="isRadio"
    v-model="radioValue"
    as="fieldset"
    :disabled="props.disabled"
    :class="cn('min-w-0 gap-3', props.class)"
  >
    <legend
      v-if="props.label"
      class="mb-1 text-sm font-semibold"
    >
      {{ props.label }}
    </legend>

    <div
      v-for="option in props.options"
      :key="option.value"
      role="presentation"
      :class="itemClasses(option)"
      @click="selectOption(option)"
    >
      <Radio
        :value="option.value"
        :disabled="props.disabled || option.disabled"
        :aria-label="option.label"
        :class="controlClasses(option)"
        @click.stop
      />
      <span :class="contentClasses()">
        <span class="text-sm font-semibold leading-none">
          {{ option.label }}
        </span>
        <span
          v-if="option.description"
          :class="descriptionClasses(option)"
        >
          {{ option.description }}
        </span>
      </span>
    </div>
  </RadioGroup>

  <fieldset
    v-else
    :disabled="props.disabled"
    :class="cn('flex min-w-0 flex-col gap-3', props.class)"
  >
    <legend
      v-if="props.label"
      class="mb-1 text-sm font-semibold"
    >
      {{ props.label }}
    </legend>

    <div
      v-for="option in props.options"
      :key="option.value"
      role="presentation"
      :class="itemClasses(option)"
      @click="selectOption(option)"
    >
      <Checkbox
        :model-value="isSelected(option.value)"
        :disabled="props.disabled || option.disabled"
        :aria-label="option.label"
        :class="controlClasses(option)"
        @click.stop
        @update:model-value="updateOption(option.value, $event ?? false)"
      />
      <span :class="contentClasses()">
        <span class="text-sm font-semibold leading-none">
          {{ option.label }}
        </span>
        <span
          v-if="option.description"
          :class="descriptionClasses(option)"
        >
          {{ option.description }}
        </span>
      </span>
    </div>
  </fieldset>
</template>
