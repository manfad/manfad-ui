<script setup lang="ts" generic="T extends Record<string, any>">
import VisAxis from '@unovis/vue/components/axis'
import VisCrosshair from '@unovis/vue/components/crosshair'
import VisGroupedBar from '@unovis/vue/components/grouped-bar'
import VisStackedBar from '@unovis/vue/components/stacked-bar'
import VisTooltip from '@unovis/vue/components/tooltip'
import VisXYContainer from '@unovis/vue/containers/xy-container'
import { computed } from 'vue'
import ChartContainer from './ChartContainer.vue'
import ChartEmpty from './ChartEmpty.vue'
import ChartLegend from './ChartLegend.vue'
import type { BarChartProps } from './types'
import { useChartTooltipRenderer } from './useChartTooltip'
import { useXYChart } from './useXYChart'
import { chartXYPadding } from './utils'

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  height: 320,
  gridLine: true,
  legend: true,
  tooltip: true,
  variant: 'grouped',
  barPadding: 0.1,
  groupPadding: 0.15,
  roundedCorners: 3,
  barMaxWidth: 64,
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

const stacked = computed(() => props.variant === 'stacked')

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
      <VisStackedBar
        v-if="stacked"
        :x="x"
        :y="y"
        :color="colors"
        :bar-padding="props.barPadding"
        :bar-max-width="props.barMaxWidth"
        :rounded-corners="props.roundedCorners"
      />
      <VisGroupedBar
        v-else
        :x="x"
        :y="y"
        :color="colors"
        :bar-padding="props.barPadding"
        :group-padding="props.groupPadding"
        :group-max-width="props.barMaxWidth * Math.max(series.length, 1)"
        :rounded-corners="props.roundedCorners"
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
        <VisCrosshair
          :x="x"
          :y="stacked ? undefined : y"
          :y-stacked="stacked ? y : undefined"
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
