<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Empty } from '@/components/ui/empty'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.empty
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Empty</CardTitle>
        <CardDescription>
          Placeholder for lists and pages with nothing to show yet.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Empty
          icon="i-lucide-package"
          title="No items yet"
          description="Create your first item to get started."
        >
          <Button size="sm">
            New item
          </Button>
        </Empty>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
