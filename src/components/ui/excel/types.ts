import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type ExcelCellType = 'string' | 'number'
export type ExcelFormat = 'xlsx' | 'csv'

export interface ExcelColumn {
  key: string
  label: string
  /**
   * Import coercion. Default `string` keeps leading zeros (phone numbers).
   * Use `number` for wages / hours / amounts.
   */
  type?: ExcelCellType
}

export interface ExcelContext {
  columns: ComputedRef<ExcelColumn[]>
  rows: Ref<Record<string, unknown>[]>
  filename: ComputedRef<string>
  exportFile: (format?: ExcelFormat) => void
  importFile: (file: File) => Promise<void>
}

export const excelContextKey: InjectionKey<ExcelContext> = Symbol('manfad-excel')
