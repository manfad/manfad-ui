import * as XLSX from 'xlsx'
import type { ExcelColumn, ExcelCellType, ExcelFormat } from './types'

/** Match kpom-ems: lowercase + strip non-alphanumeric. */
export function normalizeHeader(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Label first, then key (grill decision C). */
export function resolveColumnKey(
  header: string,
  columns: ExcelColumn[],
): string | null {
  const normalized = normalizeHeader(header)
  const byLabel = columns.find(col => normalizeHeader(col.label) === normalized)
  if (byLabel)
    return byLabel.key
  const byKey = columns.find(col => normalizeHeader(col.key) === normalized)
  return byKey?.key ?? null
}

export function coerceValue(
  value: unknown,
  type: ExcelCellType = 'string',
): string | number | null {
  if (value == null || value === '')
    return type === 'number' ? null : ''

  if (type === 'number') {
    if (typeof value === 'number' && Number.isFinite(value))
      return value
    const parsed = Number(String(value).replace(/,/g, '').trim())
    return Number.isFinite(parsed) ? parsed : null
  }

  return String(value)
}

function autoSizeColumns(
  headers: string[],
  rows: unknown[][],
): XLSX.ColInfo[] {
  return headers.map((header, index) => ({
    wch: Math.max(
      header.length,
      ...rows.map(row => String(row[index] ?? '').length),
    ) + 2,
  }))
}

function forceTextCells(
  sheet: XLSX.WorkSheet,
  columns: ExcelColumn[],
  rowCount: number,
) {
  columns.forEach((column, columnIndex) => {
    if (column.type === 'number')
      return

    const col = XLSX.utils.encode_col(columnIndex)
    for (let row = 1; row <= rowCount; row += 1) {
      const address = `${col}${row + 1}`
      const cell = sheet[address] as XLSX.CellObject | undefined
      if (!cell || cell.v == null || cell.v === '')
        continue
      sheet[address] = {
        t: 's',
        v: String(cell.v),
        z: '@',
      }
    }
  })
}

export function buildWorksheet(
  columns: ExcelColumn[],
  rows: Record<string, unknown>[],
): XLSX.WorkSheet {
  const headers = columns.map(column => column.label)
  const body = rows.map(row =>
    columns.map((column) => {
      const value = row[column.key]
      if (value == null)
        return ''
      return value
    }),
  )

  const sheet = XLSX.utils.aoa_to_sheet([headers, ...body])
  sheet['!cols'] = autoSizeColumns(headers, body)
  forceTextCells(sheet, columns, rows.length)
  return sheet
}

export function exportFile(
  columns: ExcelColumn[],
  rows: Record<string, unknown>[],
  options: {
    filename: string
    format?: ExcelFormat
  },
) {
  const format = options.format ?? 'xlsx'
  const sheet = buildWorksheet(columns, rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, 'Data')
  const base = options.filename.replace(/\.(xlsx|csv)$/i, '')
  XLSX.writeFile(workbook, `${base}.${format}`)
}

export function parseSpreadsheet(
  data: ArrayBuffer,
  columns: ExcelColumn[],
): Record<string, unknown>[] {
  const workbook = XLSX.read(new Uint8Array(data), {
    type: 'array',
    // Prefer formatted text so exported text cells keep leading zeros.
    raw: false,
  })
  const first = workbook.SheetNames[0]
  if (!first)
    return []

  const sheet = workbook.Sheets[first]
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: false,
  })

  return json.map((row) => {
    const next: Record<string, unknown> = {}
    for (const [header, value] of Object.entries(row)) {
      const key = resolveColumnKey(header, columns)
      if (!key)
        continue
      const column = columns.find(item => item.key === key)
      next[key] = coerceValue(value, column?.type ?? 'string')
    }
    return next
  }).filter(row => Object.keys(row).length > 0)
}

export async function importFile(
  file: File,
  columns: ExcelColumn[],
): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer()
  return parseSpreadsheet(buffer, columns)
}
