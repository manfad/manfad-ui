<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.toggle
const toggleBold = shallowRef(false)
const toggleItalic = shallowRef(true)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Toggle</CardTitle>
        <CardDescription>
          Pressable buttons that hold on/off state.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <Label>Toggle buttons</Label>
        <div class="flex gap-2">
          <Toggle v-model="toggleBold" aria-label="Bold">
            <span class="i-lucide-bold h-4 w-4" aria-hidden="true" />
          </Toggle>
          <Toggle
            v-model="toggleItalic"
            variant="inverted"
            aria-label="Italic"
          >
            <span class="i-lucide-italic h-4 w-4" aria-hidden="true" />
          </Toggle>
          <Toggle :model-value="false" disabled>
            Disabled
          </Toggle>
        </div>
        <p class="text-sm text-muted-foreground">
          Bold: {{ toggleBold }}, italic: {{ toggleItalic }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
