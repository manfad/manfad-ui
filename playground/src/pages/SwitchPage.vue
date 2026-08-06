<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.switch
const autoSaveEnabled = shallowRef(true)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Switch</CardTitle>
        <CardDescription>
          Immediate on/off toggle for a setting.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <div class="flex items-center gap-2">
          <Switch id="auto-save" v-model="autoSaveEnabled" />
          <Label for="auto-save">Enable automatic saving</Label>
        </div>
        <div class="flex items-center gap-2">
          <Switch id="disabled-switch" :model-value="false" disabled />
          <Label for="disabled-switch">Disabled</Label>
        </div>
        <p class="text-sm text-muted-foreground">
          Enabled: {{ autoSaveEnabled }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
