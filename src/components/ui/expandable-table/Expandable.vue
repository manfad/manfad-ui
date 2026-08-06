<script lang="ts">
import type { HTMLAttributes } from 'vue'

export interface ExpandableColumn {
  key: string
  label: string
  class?: HTMLAttributes['class']
  pin?: 'left' | 'right'
  width?: number
}

interface PinnedColumns {
  left: string[]
  right: string[]
}
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
    columns: ExpandableColumn[]
    rows: T[]
    rowKey?: string | ((row: T) => string | number)
    class?: HTMLAttributes['class']
  }>(),
  {
    rowKey: undefined,
  },
)

const expanded = defineModel<Array<string | number>>('expanded', {
  default: () => [],
})

const pinnedModel = defineModel<PinnedColumns>('pinned')

// `defineModel` defaults cannot reference `props` (they are hoisted out of
// setup), so derive the initial pin state from `columns` via a fallback.
const pinned = computed<PinnedColumns>({
  get: () => {
    if (pinnedModel.value)
      return pinnedModel.value

    const left: string[] = []
    const right: string[] = []
    for (const col of props.columns) {
      if (col.pin === 'left')
        left.push(col.key)
      else if (col.pin === 'right')
        right.push(col.key)
    }
    return { left, right }
  },
  set: (value) => {
    pinnedModel.value = value
  },
})

if (import.meta.env.DEV && props.rowKey == null) {
  console.warn(
    '[manfad/ui] Expandable: no `row-key` provided, so the array index is used '
    + 'as the row key. Expanded state will attach to the wrong rows when the '
    + 'list reorders — provide `row-key`.',
  )
}

function keyFor(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function')
    return props.rowKey(row)
  if (typeof props.rowKey === 'string')
    return row[props.rowKey]
  return index
}

const decoratedRows = computed(() =>
  props.rows.map((row, index) => {
    const key = keyFor(row, index)
    return { row, key, expanded: expanded.value.includes(key) }
  }),
)

function toggle(key: string | number): void {
  expanded.value = expanded.value.includes(key)
    ? expanded.value.filter(k => k !== key)
    : [...expanded.value, key]
}

function onRowClick(event: MouseEvent, key: string | number): void {
  const target = event.target as HTMLElement

  if (target.closest('a, button, input, select, textarea, label'))
    return

  toggle(key)
}

const colspan = computed(() => props.columns.length + 1)

// --- Column pinning -------------------------------------------------------
const DEFAULT_PIN_WIDTH = 150
const LEADING_WIDTH = 48 // chevron control column (w-12)

const columnLayout = computed(() => {
  const leftKeys = pinned.value.left
  const rightKeys = pinned.value.right
  const byKey = new Map(props.columns.map(col => [col.key, col]))

  const leftCols = leftKeys
    .map(key => byKey.get(key))
    .filter((col): col is ExpandableColumn => col != null)
  const rightCols = rightKeys
    .map(key => byKey.get(key))
    .filter((col): col is ExpandableColumn => col != null)
  const middleCols = props.columns.filter(
    col => !leftKeys.includes(col.key) && !rightKeys.includes(col.key),
  )

  const leftOffsets = new Map<string, number>()
  let offset = LEADING_WIDTH
  for (const col of leftCols) {
    leftOffsets.set(col.key, offset)
    offset += col.width ?? DEFAULT_PIN_WIDTH
  }

  const rightOffsets = new Map<string, number>()
  offset = 0
  for (let i = rightCols.length - 1; i >= 0; i--) {
    const col = rightCols[i]
    rightOffsets.set(col.key, offset)
    offset += col.width ?? DEFAULT_PIN_WIDTH
  }

  return {
    ordered: [...leftCols, ...middleCols, ...rightCols],
    leftCols,
    rightCols,
    leftOffsets,
    rightOffsets,
  }
})

const hasLeftPins = computed(() => columnLayout.value.leftCols.length > 0)

function isPinned(col: ExpandableColumn): boolean {
  return columnLayout.value.leftOffsets.has(col.key)
    || columnLayout.value.rightOffsets.has(col.key)
}

function togglePin(col: ExpandableColumn): void {
  const side = col.pin === 'right' ? 'right' : 'left'
  const current = pinned.value

  if (current.left.includes(col.key) || current.right.includes(col.key)) {
    pinned.value = {
      left: current.left.filter(key => key !== col.key),
      right: current.right.filter(key => key !== col.key),
    }
    return
  }

  pinned.value = side === 'right'
    ? { left: current.left, right: [...current.right, col.key] }
    : { left: [...current.left, col.key], right: current.right }
}

function pinStyle(col: ExpandableColumn): Record<string, string> | undefined {
  const { leftOffsets, rightOffsets } = columnLayout.value
  const width = `${col.width ?? DEFAULT_PIN_WIDTH}px`

  if (leftOffsets.has(col.key)) {
    return {
      position: 'sticky',
      left: `${leftOffsets.get(col.key)}px`,
      width,
      minWidth: width,
      maxWidth: width,
    }
  }
  if (rightOffsets.has(col.key)) {
    return {
      position: 'sticky',
      right: `${rightOffsets.get(col.key)}px`,
      width,
      minWidth: width,
      maxWidth: width,
    }
  }
  return undefined
}

function pinClass(col: ExpandableColumn, isHeader: boolean): string | undefined {
  const { leftCols, rightCols, leftOffsets, rightOffsets } = columnLayout.value
  const isLeft = leftOffsets.has(col.key)
  const isRight = rightOffsets.has(col.key)

  if (!isLeft && !isRight)
    return undefined

  const isLastLeft = isLeft && leftCols[leftCols.length - 1]?.key === col.key
  const isFirstRight = isRight && rightCols[0]?.key === col.key

  return cn(
    'bg-background',
    isHeader ? 'z-20' : 'z-10',
    isLastLeft && 'shadow-[inset_-1px_0_0_0_hsl(var(--border))]',
    isFirstRight && 'shadow-[inset_1px_0_0_0_hsl(var(--border))]',
  )
}
</script>

<template>
  <Table v-bind="$attrs" :class="props.class">
    <TableHeader>
      <TableRow>
        <TableHead
          :class="cn('w-12', hasLeftPins && 'sticky left-0 z-20 bg-background')"
        />
        <TableHead
          v-for="col in columnLayout.ordered"
          :key="col.key"
          :class="cn('group/th', col.class, pinClass(col, true))"
          :style="pinStyle(col)"
        >
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              :aria-pressed="isPinned(col)"
              aria-label="Pin column"
              :class="cn(
                'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded transition-opacity hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isPinned(col)
                  ? 'text-primary opacity-100'
                  : 'text-muted-foreground/50 opacity-0 group-hover/th:opacity-100 focus-visible:opacity-100',
              )"
              @click="togglePin(col)"
            >
              <span class="i-lucide-pin h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span>{{ col.label }}</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <template
        v-for="entry in decoratedRows"
        :key="entry.key"
      >
        <TableRow
          class="cursor-pointer"
          :data-state="entry.expanded ? 'open' : 'closed'"
          @click="onRowClick($event, entry.key)"
        >
          <TableCell
            :class="cn('w-12', hasLeftPins && 'sticky left-0 z-10 bg-background')"
          >
            <button
              type="button"
              :aria-expanded="entry.expanded"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              @click.stop="toggle(entry.key)"
            >
              <span
                class="i-lucide-chevron-down h-4 w-4 transition-transform"
                :class="entry.expanded && 'rotate-180'"
                aria-hidden="true"
              />
            </button>
          </TableCell>
          <TableCell
            v-for="col in columnLayout.ordered"
            :key="col.key"
            :class="cn(col.class, pinClass(col, false))"
            :style="pinStyle(col)"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="entry.row"
              :value="entry.row[col.key]"
            >
              {{ entry.row[col.key] }}
            </slot>
          </TableCell>
        </TableRow>
        <TableRow
          v-if="entry.expanded"
          class="hover:bg-transparent"
        >
          <TableCell :colspan="colspan" class="bg-muted/50 p-4">
            <slot name="expanded" :row="entry.row" />
          </TableCell>
        </TableRow>
      </template>
    </TableBody>
  </Table>
</template>
