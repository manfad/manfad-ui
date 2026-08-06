<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.spinner
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Spinner</CardTitle>
        <CardDescription>
          Loading indicator for inline status and busy buttons.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-4">
        <Spinner />
        <Spinner class="size-8" />
        <Button disabled>
          <Spinner class="text-primary-foreground" data-icon="inline-start" />
          Saving…
        </Button>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
