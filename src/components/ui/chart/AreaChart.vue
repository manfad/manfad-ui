<script setup lang="ts" generic="T extends Record<string, any>">
import { CurveType } from '@unovis/ts'
import VisArea from '@unovis/vue/components/area'
import VisAxis from '@unovis/vue/components/axis'
import VisCrosshair from '@unovis/vue/components/crosshair'
import VisTooltip from '@unovis/vue/components/tooltip'
import VisXYContainer from '@unovis/vue/containers/xy-container'
import { computed } from 'vue'
import ChartContainer from './ChartContainer.vue'
import ChartEmpty from './ChartEmpty.vue'
import ChartLegend from './ChartLegend.vue'
import { chartCurveTypes } from './curve'
import type { AreaChartProps } from './types'
import { useChartTooltipRenderer } from './useChartTooltip'
import { useXYChart } from './useXYChart'
import { chartXYPadding } from './utils'

const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  height: 320,
  gridLine: true,
  legend: true,
  tooltip: true,
  curve: 'smooth',
  stacked: true,
  opacity: 0.35,
  line: true,
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

// Unovis stacks whenever an Area receives several y accessors, so overlapping
// bands are drawn as one translucent Area component per series instead.
const overlaps = computed(() =>
  series.value.map((entry, index) => ({ ...entry, y: y.value[index] })))

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
      <VisArea
        v-if="props.stacked"
        :x="x"
        :y="y"
        :color="colors"
        :curve-type="curveType"
        :opacity="1"
      />
      <template v-else>
        <VisArea
          v-for="entry in overlaps"
          :key="entry.key"
          :x="x"
          :y="entry.y"
          :color="entry.color"
          :line-color="entry.color"
          :line="props.line"
          :curve-type="curveType"
          :opacity="props.opacity"
        />
      </template>
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
        <VisCrosshair
          :x="x"
          :y="props.stacked ? undefined : y"
          :y-stacked="props.stacked ? y : undefined"
          :color="colors"
          :template="crosshairTemplate"
        />
        <VisTooltip />
      </template>
    </VisXYContainer>
    <template #legend>
      <ChartLegend v-if="props.legend && !isEmpty" :items="series" />
    </template>
  </ChartContainer>
</template>
