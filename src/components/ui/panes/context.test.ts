import { describe, expect, it } from 'vitest'
import { resolvePaneSizes, resizePanePair, type PaneRegistration } from './context'

function pane(partial: Partial<PaneRegistration> & { id: string }): PaneRegistration {
  return {
    minSize: 10,
    maxSize: 100,
    ...partial,
  }
}

describe('resolvePaneSizes', () => {
  it('splits equally when sizes are omitted', () => {
    const panes = [pane({ id: 'a' }), pane({ id: 'b' }), pane({ id: 'c' })]
    const sizes = resolvePaneSizes(panes)
    expect(sizes).toHaveLength(3)
    for (const size of sizes)
      expect(size).toBeCloseTo(100 / 3)
  })

  it('gives leftover space to unsized panes', () => {
    const panes = [
      pane({ id: 'a', size: 25 }),
      pane({ id: 'b' }),
      pane({ id: 'c' }),
    ]
    expect(resolvePaneSizes(panes)).toEqual([25, 37.5, 37.5])
  })

  it('uses override when length matches', () => {
    const panes = [pane({ id: 'a' }), pane({ id: 'b' })]
    expect(resolvePaneSizes(panes, [40, 60])).toEqual([40, 60])
  })
})

describe('resizePanePair', () => {
  it('keeps the pair total constant and respects minSize', () => {
    const panes = [
      pane({ id: 'a', minSize: 20 }),
      pane({ id: 'b', minSize: 20 }),
    ]
    expect(resizePanePair([30, 70], panes, 0, -20)).toEqual([20, 80])
    expect(resizePanePair([30, 70], panes, 0, 60)).toEqual([80, 20])
  })
})
