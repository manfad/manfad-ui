import { describe, expect, it } from 'vitest'
import {
  coerceValue,
  normalizeHeader,
  resolveColumnKey,
} from './utils'
import type { ExcelColumn } from './types'

const columns: ExcelColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'workhour', label: 'Work hours', type: 'number' },
  { key: 'salary', label: 'Salary', type: 'number' },
]

describe('excel utils', () => {
  it('normalizes headers like kpom-ems', () => {
    expect(normalizeHeader('Work hours')).toBe('workhours')
    expect(normalizeHeader('workhour')).toBe('workhour')
  })

  it('resolves label before key', () => {
    expect(resolveColumnKey('Work hours', columns)).toBe('workhour')
    expect(resolveColumnKey('workhour', columns)).toBe('workhour')
    expect(resolveColumnKey('Phone', columns)).toBe('phone')
  })

  it('keeps phone-like values as strings by default', () => {
    expect(coerceValue('012-3456789')).toBe('012-3456789')
    expect(coerceValue('012-3456789', 'string')).toBe('012-3456789')
  })

  it('coerces numbers when typed', () => {
    expect(coerceValue('1,600.5', 'number')).toBe(1600.5)
    expect(coerceValue('', 'number')).toBeNull()
  })
})
