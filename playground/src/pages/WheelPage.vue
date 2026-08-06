<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { WheelPicker, WheelPickerColumn } from '@/components/ui/wheel-picker'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.wheel
const wheelValue = shallowRef('Kuching')
const cityOptions = ['Kuching', 'Kota Kinabalu', 'Kuala Lumpur', 'Penang', 'Ipoh', 'Johor Bahru']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Wheel</CardTitle>
        <CardDescription>
          Scrollable column picker — building block for TimePicker and other dial UIs.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Label>Single column</Label>
        <div class="flex items-center gap-3">
          <div class="w-40 rounded-2xl border bg-popover p-2">
            <WheelPicker>
              <WheelPickerColumn
                v-model="wheelValue"
                :options="cityOptions"
                loop
                aria-label="City"
              />
            </WheelPicker>
          </div>
          <p class="text-sm text-muted-foreground">Selected: {{ wheelValue }}</p>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
