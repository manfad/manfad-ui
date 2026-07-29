<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import { CodeBlock } from '@/components/ui/code-block'
import type { UsageExample } from '../usage-examples'

defineProps<{
  example: UsageExample
}>()
</script>

<template>
  <Card>
    <CardContent class="space-y-4 p-6">
      <h2 class="text-lg font-semibold">Usage</h2>
      <CodeBlock :content="example.content" />
    </CardContent>
  </Card>
</template>
