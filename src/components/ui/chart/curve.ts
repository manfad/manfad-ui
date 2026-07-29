import { CurveType } from '@unovis/ts'
import type { ChartCurve } from './types'

export const chartCurveTypes: Record<ChartCurve, CurveType> = {
  smooth: CurveType.MonotoneX,
  linear: CurveType.Linear,
  step: CurveType.StepAfter,
}
