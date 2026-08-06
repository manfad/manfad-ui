<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Choice,
  type ChoiceOption,
  type ChoiceVariant,
} from '@/components/ui/choice'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export type FilterVariant = ChoiceVariant
export type FilterOption = ChoiceOption

const props = withDefaults(defineProps<{
  options: FilterOption[]
  label?: string
  triggerLabel?: string
  variant?: FilterVariant
  disabled?: boolean
  class?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
}>(), {
  label: 'Category',
  variant: 'checkbox',
  disabled: false,
})

const modelValue = defineModel<string[]>({ default: () => [] })

const isRadio = computed(() => props.variant === 'radio')

const selectedOptions = computed(() =>
  props.options.filter(option => modelValue.value.includes(option.value)),
)

const selectedCount = computed(() => selectedOptions.value.length)

const displayValue = computed(() => {
  if (selectedCount.value === 0)
    return props.triggerLabel ?? props.label

  if (selectedCount.value === 1)
    return selectedOptions.value[0]?.label ?? props.label

  return props.triggerLabel ?? props.label
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :disabled="props.disabled"
        :class="cn('justify-between gap-2', props.class)"
      >
        <span class="i-lucide-list-filter" data-icon="inline-start" />
        <span class="flex items-center gap-1.5">
          <span>{{ displayValue }}</span>
          <Badge
            v-if="!isRadio && selectedCount > 1"
            variant="default"
            class="rounded-sm px-1.5 py-0 text-[10px] font-medium"
          >
            {{ selectedCount }}
          </Badge>
        </span>
        <span class="i-lucide-chevron-down" data-icon="inline-end" />
      </Button>
    </PopoverTrigger>

    <PopoverContent
      align="start"
      :class="cn('w-60 p-2 [&_legend]:px-2', props.contentClass)"
    >
      <Choice
        v-model="modelValue"
        :options="props.options"
        :label="props.label"
        :variant="props.variant"
        :disabled="props.disabled"
        class="gap-0.5"
        item-class="rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
      />
    </PopoverContent>
  </Popover>
</template>
