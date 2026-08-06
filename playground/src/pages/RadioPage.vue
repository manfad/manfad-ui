<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Radio, RadioGroup } from '@/components/ui/radio'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.radio
const status = shallowRef('open')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>RadioGroup</CardTitle>
        <CardDescription>
          Single-select control with a hollow primary ring when selected.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <RadioGroup v-model="status">
          <div class="flex items-center gap-2">
            <Radio id="status-open" value="open" />
            <Label for="status-open">Open</Label>
          </div>
          <div class="flex items-center gap-2">
            <Radio id="status-progress" value="in-progress" />
            <Label for="status-progress">In progress</Label>
          </div>
          <div class="flex items-center gap-2">
            <Radio id="status-closed" value="closed" />
            <Label for="status-closed">Closed</Label>
          </div>
        </RadioGroup>
        <p class="text-sm text-muted-foreground">
          Selected: {{ status }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
