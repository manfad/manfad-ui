<script setup lang="ts" generic="T extends Record<string, any>">
import VisDonut, { VisDonutSelectors } from '@unovis/vue/components/donut'
import VisTooltip from '@unovis/vue/components/tooltip'
import VisSingleContainer from '@unovis/vue/containers/single-container'
import { computed } from 'vue'
import ChartContainer from './ChartContainer.vue'
import ChartEmpty from './ChartEmpty.vue'
import ChartLegend from './ChartLegend.vue'
import type { ChartConfig, ChartSeriesResolved, DonutChartProps } from './types'
import { useChartTooltipRenderer } from './useChartTooltip'
import {
  chartDefaultColors,
  formatChartNumber,
  resolveAccessor,
  toChartNumber,
} from './utils'

const props = withDefaults(defineProps<DonutChartProps<T>>(), {
  height: 320,
  arcWidth: 48,
  padAngle: 0.01,
  cornerRadius: 2,
  legend: true,
  legendValues: false,
  tooltip: true,
  emptyMessage: 'No data to display',
})

const palette = computed(() => props.colors ?? chartDefaultColors)

/** One entry per data row: donut segments are the "series" here. */
const segments = computed(() => {
  const valueOf = resolveAccessor(props.value)
  const labelOf = resolveAccessor(props.label)
  return props.data.map((datum, index) => ({
    key: `${index}`,
    label: String(labelOf(datum, index) ?? ''),
    color: palette.value[index % palette.value.length],
    value: toChartNumber(valueOf(datum, index)) ?? 0,
  }))
})

const formatValue = computed(() => props.valueFormatter ?? formatChartNumber)

const config = computed<ChartConfig>(() => {
  const entries: ChartConfig = {}
  for (const segment of segments.value)
    entries[segment.key] = { label: segment.label, color: segment.color }
  return entries
})

const legendItems = computed<ChartSeriesResolved[]>(() =>
  segments.value.map(segment => ({
    key: segment.key,
    color: segment.color,
    label: props.legendValues
      ? `${segment.label} · ${formatValue.value(segment.value)}`
      : segment.label,
  })))

const isEmpty = computed(() =>
  segments.value.length === 0 || segments.value.every(segment => segment.value === 0))

const total = computed(() =>
  segments.value.reduce((sum, segment) => sum + segment.value, 0))

const valueAccessor = computed(() => (_datum: T, index: number) => segments.value[index]?.value ?? 0)
const colorAccessor = computed(() => (_datum: T, index: number) => segments.value[index]?.color)
const arcWidth = computed(() => (props.pie ? 0 : props.arcWidth))

const renderTooltip = useChartTooltipRenderer()

const tooltipTriggers = computed(() => ({
  [VisDonutSelectors.segment]: (arc: { index: number }) => {
    const segment = segments.value[arc.index]
    if (!segment)
      return null
    const share = total.value > 0 ? (segment.value / total.value) * 100 : 0
    return renderTooltip({
      title: segment.label,
      items: [{
        key: segment.key,
        label: `${share.toFixed(1)}%`,
        color: segment.color,
        value: formatValue.value(segment.value),
      }],
    })
  },
}))
</script>

<template>
  <ChartContainer :config="config" :height="props.height" :class="props.class">
    <ChartEmpty v-if="isEmpty" :message="props.emptyMessage" />
    <VisSingleContainer v-else :data="props.data">
      <VisDonut
        :value="valueAccessor"
        :color="colorAccessor"
        :arc-width="arcWidth"
        :pad-angle="props.padAngle"
        :corner-radius="props.cornerRadius"
        :central-label="props.centralLabel"
        :central-sub-label="props.centralSubLabel"
      />
      <VisTooltip v-if="props.tooltip" :triggers="tooltipTriggers" />
    </VisSingleContainer>
    <template #legend>
      <ChartLegend v-if="props.legend && !isEmpty" :items="legendItems" />
    </template>
  </ChartContainer>
</template>
