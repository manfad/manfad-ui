import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'
import type { ChartConfig } from './types'

export interface ChartContext {
  config: ComputedRef<ChartConfig>
}

export const CHART_CONTEXT_KEY: InjectionKey<ChartContext> = Symbol('manfad-chart')

/** Reads the series config provided by the nearest `ChartContainer`, if any. */
export function useChartContext(): ChartContext | undefined {
  return inject(CHART_CONTEXT_KEY, undefined)
}
