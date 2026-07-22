<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface WorkspaceSwitcherItem {
  value: string
  label: string
}

const props = withDefaults(defineProps<{
  /** App / org name shown bold on the first line. */
  title: string
  /** UnoCSS icon class for the logo tile. */
  icon?: string
  /** Selectable entries; omit (or pass empty) to render a static header. */
  items?: WorkspaceSwitcherItem[]
  /** Second line when there is nothing to switch between. */
  subtitle?: string
  placeholder?: string
  triggerLabel?: string
  class?: HTMLAttributes['class']
}>(), {
  icon: 'i-lucide-boxes',
  placeholder: 'Select…',
  triggerLabel: 'Switch context',
})

const modelValue = defineModel<string>()

const selectable = computed(() => (props.items?.length ?? 0) > 0)
</script>

<template>
  <Select
    v-if="selectable"
    :model-value="modelValue"
    @update:model-value="value => modelValue = String(value)"
  >
    <SelectTrigger
      :aria-label="props.triggerLabel"
      :class="cn(
        'h-12 w-full gap-2 border-0 bg-transparent p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>span:first-child]:hidden',
        props.class,
      )"
    >
      <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span :class="props.icon" class="h-4 w-4" aria-hidden="true" />
      </div>
      <div class="grid min-w-0 flex-1 text-left leading-tight">
        <span class="truncate text-sm font-semibold">{{ props.title }}</span>
        <span class="truncate text-xs text-muted-foreground">
          <SelectValue :placeholder="props.placeholder" />
        </span>
      </div>
      <div class="i-lucide-chevrons-up-down h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
    </SelectTrigger>
    <SelectContent side="right" align="start" :side-offset="8" class="w-auto min-w-56">
      <SelectItem v-for="item in props.items" :key="item.value" :value="item.value">
        {{ item.label }}
      </SelectItem>
    </SelectContent>
  </Select>

  <div v-else :class="cn('flex w-full items-center gap-2 p-2', props.class)">
    <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <span :class="props.icon" class="h-4 w-4" aria-hidden="true" />
    </div>
    <div class="grid min-w-0 flex-1 leading-tight">
      <span class="truncate text-sm font-semibold">{{ props.title }}</span>
      <span v-if="props.subtitle" class="truncate text-xs text-muted-foreground">{{ props.subtitle }}</span>
    </div>
  </div>
</template>
