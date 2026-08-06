<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DateFilter,
  type DateFilterMode,
  type DateSelection,
  type MonthSelection,
} from '@/components/ui/date-filter'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['date-filter']

const date = shallowRef<string>()
const dateEnd = shallowRef<string>()
const dateMode = shallowRef<DateFilterMode>('date')
const dateSelection = shallowRef<DateSelection>('single')
const monthSelection = shallowRef<MonthSelection>('single')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Date filter</CardTitle>
        <CardDescription>
          Date and month selection inside a button-triggered popover.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-start gap-3">
        <DateFilter
          v-model="date"
          v-model:end="dateEnd"
          v-model:mode="dateMode"
          v-model:selection="dateSelection"
          v-model:month-selection="monthSelection"
          label="Date"
          placeholder="dd/mm/yyyy"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Controlled values</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <p>
          <span class="text-muted-foreground">Mode:</span>
          {{ dateMode }}
        </p>
        <p>
          <span class="text-muted-foreground">Selection:</span>
          {{ dateMode === 'date' ? dateSelection : monthSelection }}
        </p>
        <p>
          <span class="text-muted-foreground">Start:</span>
          {{ date || 'any' }}
        </p>
        <p>
          <span class="text-muted-foreground">End:</span>
          {{ dateEnd || 'any' }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
