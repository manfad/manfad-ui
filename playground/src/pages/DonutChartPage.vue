<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DonutChart } from '@/components/ui/chart'
import UsageExample from '../components/UsageExample.vue'
import {
  costShareByCategory,
  formatRinggit,
  totalFleetCost,
} from '../demo-state'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['donut-chart']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>DonutChart</CardTitle>
        <CardDescription>
          Category share with central total and legend values.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DonutChart
          :data="costShareByCategory"
          value="amount"
          label="category"
          :height="280"
          legend-values
          central-label="Total"
          :central-sub-label="formatRinggit(totalFleetCost)"
          :value-formatter="formatRinggit"
        />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
