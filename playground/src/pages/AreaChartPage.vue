<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart } from '@/components/ui/chart'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import UsageExample from '../components/UsageExample.vue'
import {
  areaStacked,
  formatRinggit,
  formatRinggitAxis,
  operatingCostByMonth,
  operatingCostSeries,
} from '../demo-state'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['area-chart']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>AreaChart</CardTitle>
        <CardDescription>
          Stacked or overlapping area series.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-sm font-medium">Operating cost breakdown</h3>
          <div class="flex items-center gap-2">
            <Switch id="area-stacked" v-model="areaStacked" />
            <Label for="area-stacked" class="text-xs">Stacked</Label>
          </div>
        </div>
        <AreaChart
          :data="operatingCostByMonth"
          x="month"
          :series="operatingCostSeries"
          :stacked="areaStacked"
          :height="280"
          :y-formatter="formatRinggitAxis"
          :tooltip-formatter="formatRinggit"
        />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
