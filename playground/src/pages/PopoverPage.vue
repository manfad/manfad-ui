<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.popover
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Popover</CardTitle>
        <CardDescription>
          Short contextual content anchored to a trigger.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">
              Open popover
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p class="text-sm">
              Popovers keep short contextual information close to its trigger.
            </p>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
