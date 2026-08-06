<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide } from 'vue'
import { cn } from '@/lib/utils'
import type { ExcelColumn, ExcelFormat } from './types'
import { excelContextKey } from './types'
import { exportFile as writeExport, importFile as readImport } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  columns: ExcelColumn[]
  /** Download basename without extension. */
  filename?: string
  class?: HTMLAttributes['class']
}>(), {
  filename: 'export',
})

const rows = defineModel<Record<string, unknown>[]>('rows', {
  default: () => [],
})

const emit = defineEmits<{
  export: [payload: { format: ExcelFormat, rows: Record<string, unknown>[] }]
  import: [rows: Record<string, unknown>[]]
  error: [error: Error]
}>()

const columns = computed(() => props.columns)
const filename = computed(() => props.filename)

function exportFile(format: ExcelFormat = 'xlsx') {
  try {
    writeExport(columns.value, rows.value, {
      filename: filename.value,
      format,
    })
    emit('export', { format, rows: rows.value })
  }
  catch (error) {
    emit('error', error instanceof Error ? error : new Error('Export failed'))
  }
}

async function importFile(file: File) {
  try {
    const next = await readImport(file, columns.value)
    rows.value = next
    emit('import', next)
  }
  catch (error) {
    emit('error', error instanceof Error ? error : new Error('Import failed'))
  }
}

provide(excelContextKey, {
  columns,
  rows,
  filename,
  exportFile,
  importFile,
})
</script>

<template>
  <div :class="cn('inline-flex flex-wrap items-center gap-2', props.class)">
    <slot />
  </div>
</template>
