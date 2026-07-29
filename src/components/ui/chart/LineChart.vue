<script setup lang="ts" generic="T extends Record<string, any>">
import { CurveType } from '@unovis/ts'
import VisAxis from '@unovis/vue/components/axis'
import VisCrosshair from '@unovis/vue/components/crosshair'
import VisLine from '@unovis/vue/components/line'
import VisTooltip from '@unovis/vue/components/tooltip'
import VisXYContainer from '@unovis/vue/containers/xy-container'
import { computed } from 'vue'
import ChartContainer from './ChartContainer.vue'
import ChartEmpty from './ChartEmpty.vue'
import ChartLegend from './ChartLegend.vue'
import type { LineChartProps } from './types'
import { useChartTooltipRenderer } from './useChartTooltip'
import { useXYChart } from './useXYChart'
import { chartCurveTypes } from './curve'
import { chartXYPadding } from './utils'

const props = withDefaults(defineProps<LineChartProps<T>>(), {
  height: 320,
  gridLine: true,
  legend: true,
  tooltip: true,
  curve: 'smooth',
  lineWidth: 2,
  emptyMessage: 'No data to display',
})

const {
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
} = useXYChart(props)

const curveType = computed(() => chartCurveTypes[props.curve] ?? CurveType.MonotoneX)

const renderTooltip = useChartTooltipRenderer()

function crosshairTemplate(datum: T, _x: number | Date, _data: T[], index?: number) {
  return renderTooltip(tooltipContent(datum, index))
}
</script>

<template>
  <ChartContainer :config="config" :height="props.height" :class="props.class">
    <ChartEmpty v-if="isEmpty" :message="props.emptyMessage" />
    <VisXYContainer
      v-else
      :data="props.data"
      :x-scale="xScale"
      :y-domain="props.yDomain"
      :padding="chartXYPadding"
    >
      <VisLine
        :x="x"
        :y="y"
        :color="colors"
        :curve-type="curveType"
        :line-width="props.lineWidth"
      />
      <VisAxis
        type="x"
        :label="props.xLabel"
        :tick-format="xTickFormat"
        :tick-values="xTickValues"
        :num-ticks="props.xNumTicks"
        :grid-line="false"
        :tick-line="false"
        tick-text-hide-overlapping
      />
      <VisAxis
        type="y"
        :label="props.yLabel"
        :tick-format="yTickFormat"
        :num-ticks="props.yNumTicks"
        :grid-line="props.gridLine"
        :tick-line="false"
        :domain-line="false"
      />
      <template v-if="props.tooltip">
        <VisCrosshair :x="x" :y="y" :color="colors" :template="crosshairTemplate" />
        <VisTooltip />
      </template>
    </VisXYContainer>
    <template #legend>
      <ChartLegend v-if="props.legend && !isEmpty" :items="series" />
    </template>
  </ChartContainer>
</template>
