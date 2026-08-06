<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef, watch } from 'vue'
import { Badge } from '@/components/ui/badge'
import type { CheckboxTreeGroup, CheckboxTreeLeaf } from '@/components/ui/checkbox-tree'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** Same shape as CheckboxTree, so both can share one definition. */
  groups: CheckboxTreeGroup[]
  /** Ungrouped leaves, rendered as chips below the groups when selected. */
  items?: CheckboxTreeLeaf[]
  /** Selected leaf values to show as chips. */
  values: string[]
  /** Chip shown when nothing is selected. Defaults to "None". */
  emptyLabel?: string
  class?: HTMLAttributes['class']
}>()

const groups = computed(() =>
  props.groups
    .map(group => ({
      key: group.key,
      label: group.label,
      total: group.children.length,
      selected: group.children.filter(child => props.values.includes(child.value)),
    }))
    .filter(group => group.selected.length > 0),
)

const selectedItems = computed(() =>
  (props.items ?? []).filter(item => props.values.includes(item.value)),
)

/** Groups start expanded so selected chips are visible by default. */
const expanded = shallowRef<Set<string>>(new Set())

watch(
  groups,
  (next) => {
    const keys = new Set(next.map(group => group.key))
    // Keep existing open state for keys that remain; open new groups.
    const merged = new Set<string>()
    for (const key of keys) {
      if (expanded.value.has(key) || !expanded.value.size)
        merged.add(key)
    }
    // First paint / empty → open all current groups
    if (expanded.value.size === 0) {
      for (const key of keys)
        merged.add(key)
    }
    expanded.value = merged.size ? merged : keys
  },
  { immediate: true },
)

function toggle(key: string): void {
  const next = new Set(expanded.value)
  if (next.has(key))
    next.delete(key)
  else
    next.add(key)
  expanded.value = next
}
</script>

<template>
  <Badge v-if="values.length === 0" variant="outline">{{ emptyLabel ?? 'None' }}</Badge>
  <div v-else :class="cn('space-y-0.5', props.class)">
    <div
      v-for="group in groups"
      :key="group.key"
      class="flex flex-wrap items-center gap-1"
    >
      <button
        type="button"
        class="flex items-center gap-1 rounded-sm text-sm hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-expanded="expanded.has(group.key)"
        :aria-label="`${group.label}: ${group.selected.length} of ${group.total}`"
        @click="toggle(group.key)"
      >
        <span class="font-medium">{{ group.label }}</span>
        <span class="text-xs text-muted-foreground">{{ group.selected.length }}/{{ group.total }}</span>
        <span
          class="h-3.5 w-3.5 text-muted-foreground"
          :class="expanded.has(group.key) ? 'i-lucide-chevron-left' : 'i-lucide-chevron-right'"
          aria-hidden="true"
        />
      </button>
      <template v-if="expanded.has(group.key)">
        <Badge
          v-for="leaf in group.selected"
          :key="leaf.value"
          variant="secondary"
        >
          {{ leaf.label }}
        </Badge>
      </template>
    </div>
    <div v-if="selectedItems.length" class="flex flex-wrap gap-1">
      <Badge
        v-for="leaf in selectedItems"
        :key="leaf.value"
        variant="secondary"
      >
        {{ leaf.label }}
      </Badge>
    </div>
  </div>
</template>
