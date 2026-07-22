<script lang="ts">
export interface CheckboxTreeLeaf {
  value: string
  label: string
}

export interface CheckboxTreeGroup {
  key: string
  label: string
  children: CheckboxTreeLeaf[]
}
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const props = defineProps<{
  groups: CheckboxTreeGroup[]
  items?: CheckboxTreeLeaf[]
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string[]>({ required: true })

// All groups start expanded; only collapsed keys are tracked explicitly.
const expanded = ref<Record<string, boolean>>({})

function isExpanded(key: string): boolean {
  return expanded.value[key] ?? true
}

function toggleExpanded(key: string): void {
  expanded.value = { ...expanded.value, [key]: !isExpanded(key) }
}

function leafId(prefix: string, value: string): string {
  return `${prefix}-${value}`
}

function childrenId(key: string): string {
  return `checkbox-tree-${key}`
}

function isChecked(value: string): boolean {
  return modelValue.value.includes(value)
}

function checkedCount(group: CheckboxTreeGroup): number {
  return group.children.filter(child => isChecked(child.value)).length
}

function allChecked(group: CheckboxTreeGroup): boolean {
  return group.children.length > 0 && checkedCount(group) === group.children.length
}

function someChecked(group: CheckboxTreeGroup): boolean {
  const count = checkedCount(group)
  return count > 0 && count < group.children.length
}

function toggleLeaf(value: string, checked: boolean): void {
  const next = new Set(modelValue.value)
  if (checked)
    next.add(value)
  else
    next.delete(value)
  modelValue.value = [...next]
}

function toggleGroup(group: CheckboxTreeGroup, checked: boolean): void {
  const next = new Set(modelValue.value)
  for (const child of group.children) {
    if (checked)
      next.add(child.value)
    else
      next.delete(child.value)
  }
  modelValue.value = [...next]
}
</script>

<template>
  <div :class="cn('space-y-3', props.class)">
    <div class="space-y-2">
      <div v-for="group in props.groups" :key="group.key" class="space-y-2">
        <div class="flex items-center gap-2">
          <Checkbox
            :model-value="allChecked(group)"
            :indeterminate="someChecked(group)"
            @update:model-value="(value) => toggleGroup(group, value === true)"
          />
          <button
            type="button"
            class="flex items-center gap-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            :aria-expanded="isExpanded(group.key)"
            :aria-controls="childrenId(group.key)"
            @click="toggleExpanded(group.key)"
          >
            <span>{{ group.label }}</span>
            <span
              v-show="!isExpanded(group.key)"
              class="text-xs text-muted-foreground"
            >{{ checkedCount(group) }}/{{ group.children.length }}</span>
            <span
              class="i-lucide-chevron-right h-4 w-4 text-muted-foreground transition-transform"
              :class="isExpanded(group.key) && 'rotate-90'"
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          v-show="isExpanded(group.key)"
          :id="childrenId(group.key)"
          class="ml-2 border-l pl-4 space-y-2"
        >
          <div
            v-for="leaf in group.children"
            :key="leaf.value"
            class="flex items-center gap-2"
          >
            <Checkbox
              :id="leafId(group.key, leaf.value)"
              :model-value="isChecked(leaf.value)"
              @update:model-value="(value) => toggleLeaf(leaf.value, value === true)"
            />
            <Label :for="leafId(group.key, leaf.value)" class="font-normal">
              {{ leaf.label }}
            </Label>
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.items && props.items.length" class="space-y-2">
      <div
        v-for="leaf in props.items"
        :key="leaf.value"
        class="flex items-center gap-2"
      >
        <Checkbox
          :id="leafId('item', leaf.value)"
          :model-value="isChecked(leaf.value)"
          @update:model-value="(value) => toggleLeaf(leaf.value, value === true)"
        />
        <Label :for="leafId('item', leaf.value)" class="font-normal">
          {{ leaf.label }}
        </Label>
      </div>
    </div>
  </div>
</template>
