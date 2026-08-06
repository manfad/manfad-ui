<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { TimePicker } from '@/components/ui/time-picker'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['time-picker']
const time12 = shallowRef('14:30')
const time24 = shallowRef('09:15')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>TimePicker</CardTitle>
        <CardDescription>
          Popover + Wheel columns for 12h / 24h time entry.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <div class="space-y-2">
          <Label>12-hour</Label>
          <TimePicker v-model="time12" />
          <p class="text-sm text-muted-foreground">Value: {{ time12 }}</p>
        </div>
        <div class="space-y-2">
          <Label>24-hour, 5-minute steps</Label>
          <TimePicker v-model="time24" format="24" :minute-step="5" />
          <p class="text-sm text-muted-foreground">Value: {{ time24 }}</p>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
