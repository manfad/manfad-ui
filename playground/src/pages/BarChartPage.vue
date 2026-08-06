<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from '@/components/ui/chart'
import UsageExample from '../components/UsageExample.vue'
import {
  depotSeries,
  formatLitres,
  formatLitresAxis,
  formatRinggit,
  formatRinggitAxis,
  fuelLitresByDepot,
  workshopCostByVehicle,
  workshopSeries,
} from '../demo-state'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['bar-chart']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>BarChart</CardTitle>
        <CardDescription>
          Grouped or stacked categorical bars.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-8">
        <div class="space-y-2">
          <h3 class="text-sm font-medium">Diesel volume by depot</h3>
          <BarChart
            :data="fuelLitresByDepot"
            x="month"
            :series="depotSeries"
            :height="280"
            :y-formatter="formatLitresAxis"
            :tooltip-formatter="formatLitres"
          />
        </div>
        <div class="space-y-2">
          <h3 class="text-sm font-medium">Workshop cost per vehicle</h3>
          <BarChart
            :data="workshopCostByVehicle"
            x="vehicle"
            :series="workshopSeries"
            variant="stacked"
            :height="280"
            :y-formatter="formatRinggitAxis"
            :tooltip-formatter="formatRinggit"
          />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
