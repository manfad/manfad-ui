<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { NumberInput } from '@/components/ui/number-input'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['number-input']
const quantityValue = shallowRef<number | null>(0)
const temperatureValue = shallowRef<number | null>(null)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>NumberInput</CardTitle>
        <CardDescription>
          Numeric entry with steppers, min/max, and clearable zero.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <Label for="qty-number">Quantity (no negatives)</Label>
          <NumberInput
            id="qty-number"
            v-model="quantityValue"
            :min="0"
            :max="999"
          />
          <p class="text-sm text-muted-foreground">
            Model: {{ quantityValue === null ? 'null (cleared)' : quantityValue }} — the 0 is fully
            clearable, arrows step by 1.
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Label for="temp-number">Temperature (allow negative, step 0.5)</Label>
          <NumberInput
            id="temp-number"
            v-model="temperatureValue"
            allow-negative
            :step="0.5"
            placeholder="—"
          />
          <p class="text-sm text-muted-foreground">
            Model: {{ temperatureValue === null ? 'null' : temperatureValue }}
          </p>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
