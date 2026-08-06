<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from '@/components/ui/chart'
import UsageExample from '../components/UsageExample.vue'
import {
  depotSeries,
  formatRinggit,
  formatRinggitAxis,
  fuelSpendByMonth,
} from '../demo-state'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['line-chart']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>LineChart</CardTitle>
        <CardDescription>
          Time series with formatted axis ticks and tooltips.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-8">
        <div class="space-y-2">
          <h3 class="text-sm font-medium">Fuel spend by depot</h3>
          <LineChart
            :data="fuelSpendByMonth"
            x="month"
            :series="depotSeries"
            :height="280"
            y-label="Diesel spend"
            :y-formatter="formatRinggitAxis"
            :tooltip-formatter="formatRinggit"
          />
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-medium">Empty data</h3>
          <LineChart
            :data="[]"
            x="month"
            :series="depotSeries"
            :height="280"
            empty-message="No fuel records for this period"
          />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
