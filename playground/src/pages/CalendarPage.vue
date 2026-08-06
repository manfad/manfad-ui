<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/date-picker'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.calendar

const selectedDate = shallowRef('2026-07-31')
const rangeStart = shallowRef('2026-07-06')
const rangeEnd = shallowRef('2026-07-17')
const availableDate = shallowRef('2026-07-23')

const restDays = ['Sunday']
const excludedDates = ['2026-07-04', '2026-07-18']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Single date</CardTitle>
        <CardDescription>
          Uses the default model and demonstrates the root class prop.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Calendar
          v-model="selectedDate"
          class="rounded-lg border p-3"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ selectedDate || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Date range</CardTitle>
        <CardDescription>
          Enables range mode with separate start and end models.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Calendar
          range
          v-model:start="rangeStart"
          v-model:end="rangeEnd"
        />
        <p class="text-sm text-muted-foreground">
          Range: {{ rangeStart || 'none' }} → {{ rangeEnd || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Rest days and exclusions</CardTitle>
        <CardDescription>
          Sundays are rest days; July 4 and July 18 are explicitly excluded.
          Both disabled states use custom semantic classes.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Calendar
          v-model="availableDate"
          :restday="restDays"
          :exclude="excludedDates"
          restday-class="bg-warning/20 text-warning-foreground opacity-100"
          exclude-class="bg-destructive/10 text-destructive opacity-100 line-through"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ availableDate || 'none' }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
