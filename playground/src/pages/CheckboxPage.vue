<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.checkbox
const notificationsEnabled = shallowRef(false)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Checkbox</CardTitle>
        <CardDescription>
          Binary on/off control for a single option.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Checkbox id="notifications" v-model="notificationsEnabled" />
          <Label for="notifications">Enable email notifications</Label>
        </div>
        <div class="flex items-center gap-2">
          <Checkbox id="disabled-check" :model-value="true" disabled />
          <Label for="disabled-check">Disabled</Label>
        </div>
        <p class="text-sm text-muted-foreground">
          Checked: {{ notificationsEnabled }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
