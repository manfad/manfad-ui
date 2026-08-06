<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarSwitcher } from '@/components/ui/sidebar'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['sidebar-switcher']
const context = shallowRef('docs')
const contexts = [
  { value: 'docs', label: 'Document' },
  { value: 'playground', label: 'Playground' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Sidebar switcher</CardTitle>
        <CardDescription>
          A compact identity and context selector for a sidebar header.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="w-60 rounded-lg border bg-sidebar p-1 text-sidebar-foreground">
          <SidebarSwitcher
            v-model="context"
            title="@manfad99/ui"
            icon="i-lucide-layers"
            :items="contexts"
          />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
