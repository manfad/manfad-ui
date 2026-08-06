<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MdView } from '@/components/ui/md-view'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['md-view']
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Markdown view</CardTitle>
        <CardDescription>
          Loads a public Markdown file and renders it with raw HTML disabled.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MdView src="/md-view-demo.md" />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
