<script lang="ts">
import type { HTMLAttributes } from 'vue'

export type CollapsibleTableTint = 'none' | 'green' | 'red' | 'blue' | 'yellow' | 'gray'

export interface CollapsibleTableColumn {
  key: string
  label: string
  /** Tint for an ungrouped column; columns inside a group inherit the group tint. */
  tint?: CollapsibleTableTint
  /** Fixed column width (e.g. `7rem`, `120px`). Keeps layout stable across expand/collapse. */
  width?: string
  class?: HTMLAttributes['class']
}

export interface CollapsibleTableGroup {
  id: string
  label: string
  /** Keys of member columns from `columns`; the group renders at the first member's position. */
  columns: string[]
  tint?: CollapsibleTableTint
  /** Start expanded instead of collapsed. Ignored when `v-model:expanded` is bound. */
  defaultExpanded?: boolean
}

type CollapsibleTableUnit =
  | { type: 'column', column: CollapsibleTableColumn }
  | { type: 'group', group: CollapsibleTableGroup, members: CollapsibleTableColumn[] }
</script>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    columns: CollapsibleTableColumn[]
    columnGroups?: CollapsibleTableGroup[]
    rows: T[]
    rowKey?: string | ((row: T) => string | number)
    class?: HTMLAttributes['class']
  }>(),
  {
    columnGroups: () => [],
    rowKey: undefined,
  },
)

const emit = defineEmits<{
  rowClick: [row: T]
}>()

const expandedModel = defineModel<string[]>('expanded')

// `defineModel` defaults cannot reference `props` (they are hoisted out of
// setup), so derive the initial expanded set from `columnGroups` via a fallback.
const expanded = computed<string[]>({
  get: () =>
    expandedModel.value
    ?? props.columnGroups.filter(group => group.defaultExpanded).map(group => group.id),
  set: (value) => {
    expandedModel.value = value
  },
})

function isExpanded(group: CollapsibleTableGroup): boolean {
  return expanded.value.includes(group.id)
}

function toggleGroup(group: CollapsibleTableGroup): void {
  expanded.value = isExpanded(group)
    ? expanded.value.filter(id => id !== group.id)
    : [...expanded.value, group.id]
}

/**
 * Walk the flat columns in order; a group occupies its first member's
 * position and swallows the rest of its members, so ungrouped columns keep
 * their declared order around it.
 */
const units = computed<CollapsibleTableUnit[]>(() => {
  const byKey = new Map(props.columns.map(column => [column.key, column]))
  const groupFor = new Map<string, CollapsibleTableGroup>()
  for (const group of props.columnGroups) {
    for (const key of group.columns)
      groupFor.set(key, group)
  }

  const emitted = new Set<string>()
  const result: CollapsibleTableUnit[] = []
  for (const column of props.columns) {
    const group = groupFor.get(column.key)
    if (!group) {
      result.push({ type: 'column', column })
      continue
    }
    if (emitted.has(group.id))
      continue
    emitted.add(group.id)
    const members = group.columns
      .map(key => byKey.get(key))
      .filter((member): member is CollapsibleTableColumn => member != null)
    result.push({ type: 'group', group, members })
  }
  return result
})

/** Leaf columns in display order — always rendered in `<colgroup>` so width is stable. */
const leafColumns = computed(() =>
  units.value.flatMap((unit) => {
    if (unit.type === 'column')
      return [unit.column]
    return unit.members
  }),
)

function keyFor(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function')
    return props.rowKey(row)
  if (typeof props.rowKey === 'string')
    return row[props.rowKey]
  return index
}

const decoratedRows = computed(() =>
  props.rows.map((row, index) => ({ row, key: keyFor(row, index) })),
)

/** Vertical borders sit only between units, so an expanded group reads as one block. */
function unitEdgeClass(isLastCellOfUnit: boolean): string | undefined {
  return isLastCellOfUnit ? 'border-r last:border-r-0' : undefined
}

const CELL_SIZE = 'h-12 overflow-hidden align-middle'
</script>

<template>
  <Table
    v-bind="$attrs"
    :class="cn('table-fixed', props.class)"
  >
    <colgroup>
      <col
        v-for="column in leafColumns"
        :key="column.key"
        :style="column.width ? { width: column.width } : undefined"
      >
    </colgroup>

    <TableHeader>
      <TableRow class="hover:bg-transparent">
        <template v-for="unit in units" :key="unit.type === 'group' ? unit.group.id : unit.column.key">
          <TableHead
            v-if="unit.type === 'column'"
            :class="cn(CELL_SIZE, 'text-foreground', unitEdgeClass(true), unit.column.class)"
          >
            <span class="block truncate">{{ unit.column.label }}</span>
          </TableHead>

          <TableHead
            v-else-if="!isExpanded(unit.group)"
            :colspan="unit.members.length"
            :class="cn(CELL_SIZE, 'p-0 text-foreground', unitEdgeClass(true))"
          >
            <button
              type="button"
              class="flex h-12 w-full items-center gap-1.5 px-4 text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              :aria-expanded="false"
              :aria-label="`Expand ${unit.group.label}`"
              @click="toggleGroup(unit.group)"
            >
              <span class="i-lucide-chevron-right h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span class="truncate">{{ unit.group.label }}</span>
            </button>
          </TableHead>

          <template v-else>
            <TableHead
              v-for="(member, memberIndex) in unit.members"
              :key="member.key"
              :class="cn(CELL_SIZE, 'p-0 text-foreground', unitEdgeClass(memberIndex === unit.members.length - 1), member.class)"
            >
              <button
                type="button"
                class="flex h-12 w-full items-center gap-1.5 px-4 text-left font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                :aria-expanded="true"
                :aria-label="`Collapse ${unit.group.label}`"
                @click="toggleGroup(unit.group)"
              >
                <span
                  v-if="memberIndex === 0"
                  class="i-lucide-chevron-down h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span class="truncate">{{ member.label }}</span>
              </button>
            </TableHead>
          </template>
        </template>
      </TableRow>
    </TableHeader>

    <TableBody>
      <TableRow
        v-for="entry in decoratedRows"
        :key="entry.key"
        class="hover:bg-transparent"
        @click="emit('rowClick', entry.row)"
      >
        <template v-for="unit in units" :key="unit.type === 'group' ? unit.group.id : unit.column.key">
          <TableCell
            v-if="unit.type === 'column'"
            :class="cn(CELL_SIZE, 'px-4 py-0', unitEdgeClass(true), unit.column.class)"
          >
            <div class="truncate">
              <slot
                :name="`cell-${unit.column.key}`"
                :row="entry.row"
                :value="entry.row[unit.column.key]"
              >
                {{ entry.row[unit.column.key] }}
              </slot>
            </div>
          </TableCell>

          <TableCell
            v-else-if="!isExpanded(unit.group)"
            :colspan="unit.members.length"
            :class="cn(CELL_SIZE, 'px-4 py-0', unitEdgeClass(true))"
          >
            <div class="truncate">
              <slot :name="`collapsed-${unit.group.id}`" :row="entry.row">
                <span class="font-medium">{{ entry.row[unit.members[0]!.key] }}</span>
                <template v-for="(member, memberIndex) in unit.members" :key="member.key">
                  <span v-if="memberIndex > 0" class="text-muted-foreground">
                    · {{ entry.row[member.key] }}
                  </span>
                </template>
              </slot>
            </div>
          </TableCell>

          <template v-else>
            <TableCell
              v-for="(member, memberIndex) in unit.members"
              :key="member.key"
              :class="cn(CELL_SIZE, 'px-4 py-0', unitEdgeClass(memberIndex === unit.members.length - 1), member.class)"
            >
              <div class="truncate">
                <slot
                  :name="`cell-${member.key}`"
                  :row="entry.row"
                  :value="entry.row[member.key]"
                >
                  {{ entry.row[member.key] }}
                </slot>
              </div>
            </TableCell>
          </template>
        </template>
      </TableRow>
    </TableBody>
  </Table>
</template>
