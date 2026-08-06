<script lang="ts">
import type { HTMLAttributes } from 'vue'

export type GroupedTableTint = 'none' | 'green' | 'red' | 'blue' | 'yellow' | 'gray'

export interface GroupedTableColumn {
  key: string
  label: string
  /** Double-click (or the hover pen) opens an inline editor for this column. */
  editable?: boolean
  /**
   * Totals row content for this column: 'sum'/'avg' aggregate the rows'
   * numeric values, any other string renders literally (e.g. 'Total'), and a
   * function receives the rows. The footer row renders when any column sets this.
   */
  footer?: 'sum' | 'avg' | string | ((rows: Record<string, any>[]) => string | number)
  class?: HTMLAttributes['class']
}

export interface GroupedTableGroup {
  key: string
  /** Omit (or '') to render the group's columns spanning both header rows, without a band. */
  label?: string
  tint?: GroupedTableTint
  /** Extra classes for this group's header cells / body cells (override the tint). */
  class?: HTMLAttributes['class']
  cellClass?: HTMLAttributes['class']
  columns: GroupedTableColumn[]
}

export interface GroupedTableSave<T> {
  row: T
  rowKey: string | number
  key: string
  value: unknown
}

export interface GroupedTableRowEdits<T> {
  row: T
  rowKey: string | number
  changes: Record<string, unknown>
}

const TINT_HEADER: Record<GroupedTableTint, string> = {
  none: '',
  green: 'bg-emerald-100/80',
  red: 'bg-red-100/70',
  blue: 'bg-sky-100/70',
  yellow: 'bg-amber-100/70',
  gray: 'bg-muted',
}

const TINT_CELL: Record<GroupedTableTint, string> = {
  none: '',
  green: 'bg-emerald-50/50',
  red: 'bg-red-50/50',
  blue: 'bg-sky-50/50',
  yellow: 'bg-amber-50/60',
  gray: 'bg-muted/40',
}

/**
 * Chrome-less editor: bottom border only, no padding, tiny intrinsic width
 * (size=1 on the input) so entering edit mode never widens the column.
 */
const EDIT_INPUT_CLASS = 'h-7 w-full min-w-0 rounded-none border-0 border-b border-input bg-transparent px-0 py-0 text-sm focus-visible:border-primary focus-visible:ring-0'
</script>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
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
    groups: GroupedTableGroup[]
    rows: T[]
    rowKey?: string | ((row: T) => string | number)
    saveAllLabel?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    rowKey: undefined,
    saveAllLabel: 'Save changes',
  },
)

const emit = defineEmits<{
  /** A single cell's Save button. The draft is dropped on emit — apply the change to `rows`. */
  save: [edit: GroupedTableSave<T>]
  /** Save changes while in edit mode; one entry per row with its changed cells. Drafts are dropped on emit. */
  saveAll: [edits: GroupedTableRowEdits<T>[]]
}>()

// Focus the inline editor when it mounts (directives on Input land on its root <input>).
const vFocus = {
  mounted: (el: HTMLInputElement) => {
    el.focus()
    el.select?.()
  },
}

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

const bandedGroups = computed(() => props.groups.filter(group => group.label))
const hasBands = computed(() => bandedGroups.value.length > 0)
const hasFooter = computed(() =>
  props.groups.some(group => group.columns.some(column => column.footer !== undefined)),
)

function footerValue(column: GroupedTableColumn): string | number {
  const footer = column.footer
  if (footer === undefined)
    return ''
  if (typeof footer === 'function')
    return footer(props.rows)
  if (footer === 'sum' || footer === 'avg') {
    const values = props.rows
      .map(row => Number(row[column.key]))
      .filter(value => !Number.isNaN(value))
    const sum = Number(values.reduce((acc, value) => acc + value, 0).toFixed(10))
    if (footer === 'sum')
      return sum
    return values.length ? Number((sum / values.length).toFixed(2)) : 0
  }
  return footer
}

function headerClass(group: GroupedTableGroup): string {
  return cn(TINT_HEADER[group.tint ?? 'none'], group.class)
}

function cellTintClass(group: GroupedTableGroup): string {
  return cn(TINT_CELL[group.tint ?? 'none'], group.cellClass ?? group.class)
}

// --- Inline editing -------------------------------------------------------
// Drafts survive leaving the cell; a draft equal to the row's current value
// counts as clean, so parent updates after save reconcile automatically.
const drafts = shallowRef<Record<string, unknown>>({})
const editingCell = shallowRef<string | null>(null)
const editValue = shallowRef('')

// Table-wide edit mode: every editable column renders an input at once.
const editMode = shallowRef(false)
const hasEditableColumns = computed(() =>
  props.groups.some(group => group.columns.some(column => column.editable)),
)

function toggleEditMode(): void {
  editMode.value = !editMode.value
  editingCell.value = null
}

function cancelEditMode(): void {
  drafts.value = {}
  editingCell.value = null
  editMode.value = false
}

function saveEditMode(): void {
  saveAll()
  editingCell.value = null
  editMode.value = false
}

function cellId(rowKey: string | number, columnKey: string): string {
  return `${rowKey}::${columnKey}`
}

function draftFor(rowKey: string | number, column: GroupedTableColumn, row: T): unknown {
  const id = cellId(rowKey, column.key)
  return id in drafts.value ? drafts.value[id] : row[column.key]
}

function isDirty(rowKey: string | number, column: GroupedTableColumn, row: T): boolean {
  const id = cellId(rowKey, column.key)
  return id in drafts.value && drafts.value[id] !== row[column.key]
}

const dirtyByRow = computed(() => {
  const edits: GroupedTableRowEdits<T>[] = []
  const columns = props.groups.flatMap(group => group.columns)
  for (const entry of decoratedRows.value) {
    const changes: Record<string, unknown> = {}
    for (const column of columns) {
      if (isDirty(entry.key, column, entry.row))
        changes[column.key] = drafts.value[cellId(entry.key, column.key)]
    }
    if (Object.keys(changes).length > 0)
      edits.push({ row: entry.row, rowKey: entry.key, changes })
  }
  return edits
})

function startEdit(rowKey: string | number, column: GroupedTableColumn, row: T): void {
  if (!column.editable)
    return
  editingCell.value = cellId(rowKey, column.key)
  editValue.value = String(draftFor(rowKey, column, row) ?? '')
}

function commitEdit(rowKey: string | number, column: GroupedTableColumn, row: T): void {
  if (editingCell.value !== cellId(rowKey, column.key))
    return
  editingCell.value = null

  const original = row[column.key]
  let next: unknown = editValue.value
  if (typeof original === 'number') {
    const parsed = Number(editValue.value)
    if (Number.isNaN(parsed))
      return
    next = parsed
  }

  const id = cellId(rowKey, column.key)
  if (next === original) {
    const { [id]: _, ...rest } = drafts.value
    drafts.value = rest
    return
  }
  drafts.value = { ...drafts.value, [id]: next }
}

function cancelEdit(): void {
  editingCell.value = null
}

/** Edit-mode inputs write drafts live; values matching the row revert to clean. */
function setDraft(rowKey: string | number, column: GroupedTableColumn, row: T, raw: string): void {
  const id = cellId(rowKey, column.key)
  const original = row[column.key]
  let next: unknown = raw
  if (typeof original === 'number') {
    const parsed = Number(raw)
    if (raw.trim() === '' || Number.isNaN(parsed))
      return
    next = parsed
  }
  if (next === original) {
    const { [id]: _, ...rest } = drafts.value
    drafts.value = rest
    return
  }
  drafts.value = { ...drafts.value, [id]: next }
}

function clearDraft(rowKey: string | number, columnKey: string): void {
  const { [cellId(rowKey, columnKey)]: _, ...rest } = drafts.value
  drafts.value = rest
}

function saveCell(rowKey: string | number, column: GroupedTableColumn, row: T): void {
  const value = drafts.value[cellId(rowKey, column.key)]
  clearDraft(rowKey, column.key)
  emit('save', { row, rowKey, key: column.key, value })
}

/** Enter / the inline check: commit the editor value and save it immediately. */
function commitAndSave(rowKey: string | number, column: GroupedTableColumn, row: T): void {
  commitEdit(rowKey, column, row)
  if (isDirty(rowKey, column, row))
    saveCell(rowKey, column, row)
}

function saveAll(): void {
  const edits = dirtyByRow.value
  drafts.value = {}
  emit('saveAll', edits)
}

defineExpose({ clearDrafts: () => (drafts.value = {}) })
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <div v-if="hasEditableColumns" class="flex justify-end gap-2">
      <template v-if="editMode">
        <Button size="sm" variant="outline" @click="cancelEditMode">
          Cancel
        </Button>
        <Button size="sm" @click="saveEditMode">
          <span class="i-lucide-check mr-1.5 h-4 w-4" aria-hidden="true" />
          {{ props.saveAllLabel }}
        </Button>
      </template>
      <Button
        v-else
        size="sm"
        variant="outline"
        @click="toggleEditMode"
      >
        <span class="i-lucide-pencil mr-1.5 h-4 w-4" aria-hidden="true" />
        Edit Mode
      </Button>
    </div>

    <div class="overflow-hidden rounded-lg border">
      <Table v-bind="$attrs">
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <template v-for="group in props.groups" :key="group.key">
              <TableHead
                v-if="group.label"
                :colspan="group.columns.length"
                :class="cn('h-10 border-b border-r text-center font-semibold text-foreground last:border-r-0', headerClass(group))"
              >
                {{ group.label }}
              </TableHead>
              <TableHead
                v-for="column in (group.label ? [] : group.columns)"
                :key="column.key"
                :rowspan="hasBands ? 2 : 1"
                :class="cn('border-r last:border-r-0', headerClass(group), column.class)"
              >
                {{ column.label }}
              </TableHead>
            </template>
          </TableRow>
          <TableRow v-if="hasBands" class="hover:bg-transparent">
            <template v-for="group in bandedGroups" :key="group.key">
              <TableHead
                v-for="column in group.columns"
                :key="column.key"
                :class="cn('h-10 border-r text-foreground/80 last:border-r-0', headerClass(group), column.class)"
              >
                {{ column.label }}
              </TableHead>
            </template>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="entry in decoratedRows" :key="entry.key">
            <template v-for="group in props.groups" :key="group.key">
              <TableCell
                v-for="column in group.columns"
                :key="column.key"
                :class="cn('group/cell border-r p-3 last:border-r-0', cellTintClass(group), column.class)"
                @dblclick="!editMode && startEdit(entry.key, column, entry.row)"
              >
                <Input
                  v-if="editMode && column.editable"
                  size="1"
                  :model-value="String(draftFor(entry.key, column, entry.row) ?? '')"
                  :class="cn(EDIT_INPUT_CLASS, isDirty(entry.key, column, entry.row) && 'border-warning')"
                  :aria-label="`Edit ${column.label}`"
                  @update:model-value="value => setDraft(entry.key, column, entry.row, String(value))"
                />

                <div v-else-if="editingCell === cellId(entry.key, column.key)" class="flex min-h-7 items-center gap-1">
                  <Input
                    v-focus
                    size="1"
                    :model-value="editValue"
                    :class="EDIT_INPUT_CLASS"
                    @update:model-value="value => editValue = String(value)"
                    @keydown.enter.prevent="commitAndSave(entry.key, column, entry.row)"
                    @keydown.esc="cancelEdit"
                    @blur="commitEdit(entry.key, column, entry.row)"
                  />
                  <button
                    type="button"
                    class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Save edit"
                    @mousedown.prevent
                    @click="commitAndSave(entry.key, column, entry.row)"
                  >
                    <span class="i-lucide-check h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div v-else class="flex min-h-7 items-center gap-1.5">
                  <span :class="isDirty(entry.key, column, entry.row) ? 'rounded bg-warning/20 px-1 font-medium' : undefined">
                    <slot
                      :name="`cell-${column.key}`"
                      :row="entry.row"
                      :value="draftFor(entry.key, column, entry.row)"
                    >
                      {{ draftFor(entry.key, column, entry.row) }}
                    </slot>
                  </span>

                  <div class="flex items-center gap-1">
                    <template v-if="isDirty(entry.key, column, entry.row)">
                      <button
                        type="button"
                        class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Save cell"
                        @click="saveCell(entry.key, column, entry.row)"
                      >
                        <span class="i-lucide-check h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        aria-label="Discard cell change"
                        @click="clearDraft(entry.key, column.key)"
                      >
                        <span class="i-lucide-undo-2 h-4 w-4" aria-hidden="true" />
                      </button>
                    </template>

                    <button
                      v-else-if="column.editable"
                      type="button"
                      class="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground/60 opacity-0 transition-opacity hover:bg-accent focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover/cell:opacity-100"
                      aria-label="Edit cell"
                      @click="startEdit(entry.key, column, entry.row)"
                    >
                      <span class="i-lucide-pencil h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </TableCell>
            </template>
          </TableRow>
        </TableBody>

        <TableFooter v-if="hasFooter">
          <TableRow class="hover:bg-transparent">
            <template v-for="group in props.groups" :key="group.key">
              <TableCell
                v-for="column in group.columns"
                :key="column.key"
                :class="cn('border-r p-3 font-medium last:border-r-0', headerClass(group), column.class)"
              >
                {{ footerValue(column) }}
              </TableCell>
            </template>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  </div>
</template>
