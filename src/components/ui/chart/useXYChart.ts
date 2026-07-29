import { Scale } from '@unovis/ts'
// Named explicitly so the emitted declarations don't have to reach into
// @types/d3-scale to describe the scale returned by `xScale`.
import type { ContinuousScale } from '@unovis/ts/types/scale'
import { computed } from 'vue'
import type { ChartTooltipContent } from './useChartTooltip'
import type {
  ChartConfig,
  ChartSeriesResolved,
  ChartXValue,
  ChartXYProps,
} from './types'
import {
  formatChartDate,
  formatChartNumber,
  resolveAccessor,
  resolveSeries,
  subsampleTickValues,
  toChartNumber,
} from './utils'

const DEFAULT_MAX_CATEGORY_TICKS = 16

/**
 * Everything the cartesian charts share: series resolution, x/y accessors, axis
 * tick formatting and tooltip contents. `props` stays reactive because it comes
 * straight from `defineProps`.
 */
export function useXYChart<T>(props: ChartXYProps<T>) {
  const series = computed<ChartSeriesResolved[]>(() => resolveSeries(props.series))

  const config = computed<ChartConfig>(() => {
    const entries: ChartConfig = {}
    for (const entry of series.value)
      entries[entry.key] = { label: entry.label, color: entry.color }
    return entries
  })

  const rawX = computed<ChartXValue[]>(() => {
    const accessor = resolveAccessor(props.x)
    return props.data.map((datum, index) => accessor(datum, index))
  })

  const xType = computed<'number' | 'time' | 'category'>(() => {
    if (props.xType && props.xType !== 'auto')
      return props.xType
    const first = rawX.value.find(value => value != null)
    if (first instanceof Date)
      return 'time'
    if (typeof first === 'string')
      return 'category'
    return 'number'
  })

  const categories = computed<string[]>(() =>
    xType.value === 'category' ? rawX.value.map(value => String(value ?? '')) : [],
  )

  const x = computed(() => {
    const accessor = resolveAccessor(props.x)
    const categorical = xType.value === 'category'
    return (datum: T, index: number): number =>
      categorical ? index : toChartNumber(accessor(datum, index)) ?? index
  })

  const y = computed(() =>
    series.value.map(entry => (datum: T): number | null =>
      toChartNumber((datum as Record<string, unknown>)[entry.key])),
  )

  const colors = computed(() => series.value.map(entry => entry.color))

  const isEmpty = computed(() => {
    if (props.data.length === 0 || series.value.length === 0)
      return true
    return !props.data.some(datum =>
      series.value.some(entry =>
        toChartNumber((datum as Record<string, unknown>)[entry.key]) != null))
  })

  /** Drives the default date format: short window vs. months across a year. */
  const xSpan = computed(() => {
    if (xType.value !== 'time')
      return 0
    const values = rawX.value
      .map(value => toChartNumber(value))
      .filter((value): value is number => value != null)
    if (values.length < 2)
      return 0
    return Math.max(...values) - Math.min(...values)
  })

  // A time axis needs a real time scale, otherwise d3 picks ticks at arbitrary
  // millisecond offsets and the labels read as noise.
  const xScale = computed<ContinuousScale | undefined>(() =>
    xType.value === 'time' ? Scale.scaleTime() : undefined)

  const xTickValues = computed(() =>
    xType.value === 'category'
      ? subsampleTickValues(props.data.length, props.xNumTicks ?? DEFAULT_MAX_CATEGORY_TICKS)
      : undefined,
  )

  function formatXValue(value: ChartXValue, index: number): string {
    if (props.xFormatter)
      return props.xFormatter(value, index)
    if (xType.value === 'category')
      return String(value ?? '')
    if (xType.value === 'time') {
      const date = value instanceof Date ? value : new Date(Number(value))
      return formatChartDate(date, xSpan.value)
    }
    return formatChartNumber(Number(value))
  }

  const xTickFormat = computed(() => (tick: number | Date, index: number): string => {
    if (xType.value === 'category') {
      const position = Math.round(tick instanceof Date ? tick.getTime() : tick)
      return categories.value[position] ?? ''
    }
    const value: ChartXValue = xType.value === 'time'
      ? (tick instanceof Date ? tick : new Date(Number(tick)))
      : Number(tick)
    return formatXValue(value, index)
  })

  const formatTick = computed(() => props.yFormatter ?? formatChartNumber)
  const formatValue = computed(() =>
    props.tooltipFormatter ?? props.yFormatter ?? formatChartNumber)

  const yTickFormat = computed(() => (tick: number | Date): string =>
    formatTick.value(tick instanceof Date ? tick.getTime() : tick))

  /** Builds the tooltip body for the datum the crosshair snapped to. */
  function tooltipContent(datum: T | undefined, fallbackIndex?: number): ChartTooltipContent {
    const index = datum ? props.data.indexOf(datum) : (fallbackIndex ?? -1)
    const record = (datum ?? props.data[index]) as Record<string, unknown> | undefined
    const rawValue = index >= 0 ? rawX.value[index] : undefined

    return {
      title: rawValue == null ? undefined : formatXValue(rawValue, index),
      items: series.value.map((entry) => {
        const value = record ? toChartNumber(record[entry.key]) : null
        return {
          key: entry.key,
          label: entry.label,
          color: entry.color,
          value: value == null ? '—' : formatValue.value(value),
        }
      }),
    }
  }

  return {
    series,
    config,
    colors,
    isEmpty,
    x,
    y,
    xScale,
    xTickFormat,
    xTickValues,
    yTickFormat,
    tooltipContent,
  }
}
