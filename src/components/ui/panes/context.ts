import type { ComputedRef, InjectionKey, Ref } from 'vue'

export type PanesVariant = 'horizontal' | 'vertical'

export interface PaneRegistration {
  id: string
  size?: number
  minSize: number
  maxSize: number
}

export interface PanesContext {
  variant: ComputedRef<PanesVariant>
  resizable: ComputedRef<boolean>
  square: ComputedRef<boolean>
  paneIds: Ref<string[]>
  register: (pane: PaneRegistration) => void
  unregister: (id: string) => void
  updatePane: (id: string, patch: Partial<Omit<PaneRegistration, 'id'>>) => void
  getSize: (id: string) => number
  beginResize: (beforeIndex: number, clientPos: number) => void
  moveResize: (clientPos: number) => void
  endResize: () => void
  nudgeResize: (beforeIndex: number, deltaPct: number) => void
}

export const PANES_INJECTION_KEY: InjectionKey<PanesContext> = Symbol('manfad-panes')

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Derive percentage sizes from pane props, then clamp to min/max. */
export function resolvePaneSizes(
  panes: PaneRegistration[],
  override?: number[] | null,
): number[] {
  const count = panes.length
  if (count === 0)
    return []

  let sizes: number[]

  if (override && override.length === count) {
    sizes = [...override]
  }
  else {
    const explicitSum = panes.reduce((sum, pane) => sum + (pane.size ?? 0), 0)
    const unsizedCount = panes.filter(pane => pane.size == null).length
    const leftover = Math.max(0, 100 - explicitSum)
    const share = unsizedCount > 0 ? leftover / unsizedCount : 0

    sizes = panes.map(pane => pane.size ?? share)

    if (unsizedCount === 0 && explicitSum > 0 && Math.abs(explicitSum - 100) > 0.01)
      sizes = sizes.map(size => (size / explicitSum) * 100)
  }

  return normalizeSizes(sizes, panes)
}

function normalizeSizes(sizes: number[], panes: PaneRegistration[]): number[] {
  const next = sizes.map((size, index) =>
    clamp(size, panes[index]?.minSize ?? 0, panes[index]?.maxSize ?? 100),
  )

  const total = next.reduce((sum, size) => sum + size, 0)
  if (total <= 0)
    return panes.map(() => 100 / Math.max(panes.length, 1))

  if (Math.abs(total - 100) < 0.01)
    return next

  return next.map(size => (size / total) * 100)
}

/** Resize the pair of panes around a gutter; keeps their combined size constant. */
export function resizePanePair(
  sizes: number[],
  panes: PaneRegistration[],
  beforeIndex: number,
  deltaPct: number,
): number[] {
  const afterIndex = beforeIndex + 1
  if (beforeIndex < 0 || afterIndex >= sizes.length)
    return sizes

  const pair = sizes[beforeIndex]! + sizes[afterIndex]!
  const minA = panes[beforeIndex]?.minSize ?? 0
  const maxA = panes[beforeIndex]?.maxSize ?? 100
  const minB = panes[afterIndex]?.minSize ?? 0
  const maxB = panes[afterIndex]?.maxSize ?? 100

  const minSizeA = Math.max(minA, pair - maxB)
  const maxSizeA = Math.min(maxA, pair - minB)
  const sizeA = clamp(sizes[beforeIndex]! + deltaPct, minSizeA, maxSizeA)

  const next = [...sizes]
  next[beforeIndex] = sizeA
  next[afterIndex] = pair - sizeA
  return next
}
