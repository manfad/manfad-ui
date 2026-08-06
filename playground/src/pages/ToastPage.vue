<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toast'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.toast
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Toast</CardTitle>
        <CardDescription>
          Transient feedback for success, warning, error, and info.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          @click="toast({ title: 'Saved', description: 'Your changes have been saved.', action: { label: 'Undo', onClick: () => toast.info({ title: 'Undone' }) } })"
        >
          Default toast
        </Button>
        <Button
          variant="success"
          @click="toast.success({ title: 'Success', description: 'Record created successfully.' })"
        >
          Success
        </Button>
        <Button
          variant="warning"
          @click="toast.warning({ title: 'Warning', description: 'Quota is almost exhausted.' })"
        >
          Warning
        </Button>
        <Button
          variant="danger"
          @click="toast.error({ title: 'Error', description: 'Failed to save the record.' })"
        >
          Error
        </Button>
        <Button
          variant="ghost"
          @click="toast.info({ title: 'Heads up', description: 'A new version is available.' })"
        >
          Info
        </Button>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
