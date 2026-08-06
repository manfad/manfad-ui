<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mode, ModeToggle } from '@/components/ui/mode-toggle'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['mode-toggle']
const mode = shallowRef('docs')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>ModeToggle</CardTitle>
        <CardDescription>
          Button that cycles through declarative
          <code class="rounded bg-muted px-1 font-mono text-[0.85em]">Mode</code>
          options. Press
          <kbd class="rounded border bg-muted px-1 font-mono text-[10px]">D</kbd>
          to cycle when focus is not in a field.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <ModeToggle v-model="mode" shortcut="d">
          <Mode value="docs">Document</Mode>
          <Mode value="playground">Playground</Mode>
          <Mode value="extra">Extra</Mode>
        </ModeToggle>
        <p class="text-sm text-muted-foreground">
          Active: {{ mode }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
