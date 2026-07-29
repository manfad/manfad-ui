import type {
  ChartAccessor,
  ChartSeries,
  ChartSeriesResolved,
} from './types'

/**
 * Default series palette. These reference the design tokens rather than literal
 * colors so charts follow `.dark` and the runtime palette switcher for free.
 */
export const chartDefaultColors: readonly string[] = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

/**
 * Unovis styles itself through `--vis-*` custom properties. Re-pointing them at
 * the design tokens is what makes its tooltips, axes and labels match the rest
 * of the kit. The `--vis-dark-*` twins are set too: Unovis flips to them under
 * its own dark selectors (`html.theme-dark` and friends), which an embedding app
 * may happen to use.
 */
export const chartVisCssVars: Record<string, string> = {
  '--vis-font-family': 'inherit',
  '--vis-axis-font-family': 'inherit',
  '--vis-legend-font-family': 'inherit',
  '--vis-color-grey': 'hsl(var(--border))',

  // The tooltip chrome is drawn by Unovis, the contents by ChartTooltip.
  '--vis-tooltip-background-color': 'hsl(var(--popover))',
  '--vis-tooltip-border-color': 'hsl(var(--border))',
  '--vis-tooltip-text-color': 'hsl(var(--popover-foreground))',
  '--vis-tooltip-shadow-color': 'hsl(var(--foreground) / 0.12)',
  '--vis-tooltip-box-shadow': '0 4px 12px hsl(var(--foreground) / 0.12)',
  '--vis-tooltip-border-radius': 'var(--radius, 0.5rem)',
  '--vis-tooltip-padding': '0px',
  '--vis-dark-tooltip-background-color': 'hsl(var(--popover))',
  '--vis-dark-tooltip-border-color': 'hsl(var(--border))',
  '--vis-dark-tooltip-text-color': 'hsl(var(--popover-foreground))',
  '--vis-dark-tooltip-shadow-color': 'hsl(var(--foreground) / 0.12)',

  '--vis-axis-tick-color': 'hsl(var(--border))',
  '--vis-axis-tick-label-color': 'hsl(var(--muted-foreground))',
  '--vis-axis-tick-label-font-size': '0.75rem',
  '--vis-axis-domain-color': 'hsl(var(--border))',
  '--vis-axis-grid-color': 'hsl(var(--border))',
  '--vis-axis-label-color': 'hsl(var(--muted-foreground))',
  '--vis-axis-label-font-size': '0.75rem',
  '--vis-dark-axis-tick-color': 'hsl(var(--border))',
  '--vis-dark-axis-tick-label-color': 'hsl(var(--muted-foreground))',
  '--vis-dark-axis-domain-color': 'hsl(var(--border))',
  '--vis-dark-axis-grid-color': 'hsl(var(--border))',
  '--vis-dark-axis-label-color': 'hsl(var(--muted-foreground))',

  '--vis-crosshair-line-stroke-color': 'hsl(var(--muted-foreground))',
  '--vis-crosshair-line-stroke-opacity': '0.4',
  '--vis-crosshair-circle-stroke-color': 'hsl(var(--background))',

  '--vis-legend-label-color': 'hsl(var(--muted-foreground))',

  '--vis-donut-background-color': 'hsl(var(--muted))',
  '--vis-donut-central-label-text-color': 'hsl(var(--foreground))',
  '--vis-donut-central-sub-label-text-color': 'hsl(var(--muted-foreground))',
  '--vis-dark-donut-background-color': 'hsl(var(--muted))',
  '--vis-dark-donut-central-label-text-color': 'hsl(var(--foreground))',
  '--vis-dark-donut-central-sub-label-text-color': 'hsl(var(--muted-foreground))',
}

/**
 * Breathing room inside the axes. Without it a peak sitting at the top of the
 * domain is drawn flush against the plot edge and reads as clipped.
 */
export const chartXYPadding = { top: 10, right: 8 }

export function resolveAccessor<T, V>(
  accessor: ChartAccessor<T, V>,
): (datum: T, index: number) => V {
  if (typeof accessor === 'function')
    return accessor
  return (datum: T) => (datum as Record<string, unknown>)[accessor] as V
}

export function resolveSeries(
  series: ChartSeries[],
  palette: readonly string[] = chartDefaultColors,
): ChartSeriesResolved[] {
  return series.map((entry, index) => ({
    key: entry.key,
    label: entry.label ?? entry.key,
    color: entry.color ?? palette[index % palette.length],
  }))
}

export function toChartNumber(value: unknown): number | null {
  if (value == null || value === '')
    return null
  const numeric = value instanceof Date ? value.getTime() : Number(value)
  return Number.isFinite(numeric) ? numeric : null
}

export function toCssLength(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

const DAY_MS = 86_400_000

/**
 * Readable default for time axes: day/month while the window is short, month/year
 * once it spans more than roughly half a year (the usual admin "last N months").
 */
export function formatChartDate(value: Date, spanMs: number): string {
  const options: Intl.DateTimeFormatOptions = spanMs > 180 * DAY_MS
    ? { month: 'short', year: 'numeric' }
    : { month: 'short', day: 'numeric' }
  return new Intl.DateTimeFormat(undefined, options).format(value)
}

export function formatChartNumber(value: number): string {
  if (!Number.isFinite(value))
    return ''
  let maximumFractionDigits = 1
  if (Number.isInteger(value))
    maximumFractionDigits = 0
  else if (Math.abs(value) < 1)
    maximumFractionDigits = 2
  return value.toLocaleString(undefined, { maximumFractionDigits })
}

/** Keeps categorical axes readable by dropping ticks once labels would collide. */
export function subsampleTickValues(count: number, maxTicks = 16): number[] {
  if (count <= 0)
    return []
  const step = Math.max(1, Math.ceil(count / maxTicks))
  const ticks: number[] = []
  for (let index = 0; index < count; index += step)
    ticks.push(index)
  return ticks
}
