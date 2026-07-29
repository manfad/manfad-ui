import type { HTMLAttributes } from 'vue'

/** Either a property name on the datum or a function reading the value off it. */
export type ChartAccessor<T, V> = (keyof T & string) | ((datum: T, index: number) => V)

/** A plottable series: one line, one area band, one bar stack segment. */
export interface ChartSeries {
  key: string
  label?: string
  /** Any CSS color. Defaults to `hsl(var(--chart-N))`, cycling through the five tokens. */
  color?: string
}

export interface ChartSeriesResolved {
  key: string
  label: string
  color: string
}

/** Series metadata shared with descendants through `ChartContainer`. */
export type ChartConfig = Record<string, { label: string, color: string }>

export type ChartNumberFormatter = (value: number) => string

/** X values may be numeric, categorical strings, `Date`s or ms timestamps. */
export type ChartXValue = number | string | Date

export type ChartXFormatter = (value: ChartXValue, index: number) => string

/**
 * `auto` infers from the first x value: `Date` → time, string → category,
 * anything else → number. Pass `time` explicitly when x values are already
 * millisecond timestamps.
 */
export type ChartXType = 'auto' | 'number' | 'time' | 'category'

export type ChartCurve = 'smooth' | 'linear' | 'step'

export interface ChartTooltipItem {
  key: string
  label: string
  color?: string
  value: string
}

/** Props shared by every cartesian chart (line, area, bar). */
export interface ChartXYProps<T> {
  data: T[]
  /** Property name or accessor for the horizontal position. */
  x: ChartAccessor<T, ChartXValue>
  series: ChartSeries[]
  xType?: ChartXType
  /** CSS length; plain numbers are treated as pixels. Default: `320`. */
  height?: number | string
  xLabel?: string
  yLabel?: string
  /** Formats x axis ticks and the tooltip title. Receives the original x value. */
  xFormatter?: ChartXFormatter
  /** Formats y axis ticks — money, liters, percentages. */
  yFormatter?: ChartNumberFormatter
  /** Formats values inside the tooltip. Defaults to `yFormatter`. */
  tooltipFormatter?: ChartNumberFormatter
  xNumTicks?: number
  yNumTicks?: number
  /** Horizontal grid lines. Default: `true`. */
  gridLine?: boolean
  legend?: boolean
  tooltip?: boolean
  emptyMessage?: string
  yDomain?: [number | undefined, number | undefined]
  class?: HTMLAttributes['class']
}

export interface LineChartProps<T> extends ChartXYProps<T> {
  curve?: ChartCurve
  lineWidth?: number
}

export interface AreaChartProps<T> extends ChartXYProps<T> {
  curve?: ChartCurve
  /** Stack the bands (default) or overlay them as translucent areas. */
  stacked?: boolean
  /** Fill opacity of overlapping areas. Ignored when `stacked`. Default: `0.35`. */
  opacity?: number
  /** Draw a solid line along the top edge of each band. */
  line?: boolean
}

export interface BarChartProps<T> extends ChartXYProps<T> {
  variant?: 'grouped' | 'stacked'
  /** Fractional gap between bars, `0` to `1`. */
  barPadding?: number
  /** Fractional gap between groups, `0` to `1`. Ignored when stacked. */
  groupPadding?: number
  roundedCorners?: number | boolean
  /** Caps bar/group width so a two-point chart does not draw slabs. */
  barMaxWidth?: number
}

export interface DonutChartProps<T> {
  data: T[]
  /** Property name or accessor for the segment value. */
  value: ChartAccessor<T, number>
  /** Property name or accessor for the segment label. */
  label: ChartAccessor<T, string>
  /** Overrides the default `--chart-1..5` palette, cycled across segments. */
  colors?: string[]
  /** Ring thickness in pixels. Default: `48`. */
  arcWidth?: number
  /** Render a filled pie instead of a ring. */
  pie?: boolean
  centralLabel?: string
  centralSubLabel?: string
  /** Formats tooltip and legend values — money, liters, counts. */
  valueFormatter?: ChartNumberFormatter
  padAngle?: number
  cornerRadius?: number
  /** Show each segment's value next to its legend label. */
  legendValues?: boolean
  height?: number | string
  legend?: boolean
  tooltip?: boolean
  emptyMessage?: string
  class?: HTMLAttributes['class']
}
