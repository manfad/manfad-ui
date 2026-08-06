<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.progress
const progressValue = shallowRef(33)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
        <CardDescription>
          Determinate progress for long-running work. Default variant is
          <code class="text-xs">bar</code>.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Progress v-model="progressValue" />
        <div class="flex flex-wrap items-center gap-6">
          <Progress v-model="progressValue" variant="circle" />
          <Progress v-model="progressValue" variant="circle" :size="64" :stroke-width="5">
            <template #default="{ percent }">
              {{ Math.round(percent) }}%
            </template>
          </Progress>
        </div>
        <div class="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" @click="progressValue = 33">
            33%
          </Button>
          <Button size="sm" variant="outline" @click="progressValue = 66">
            66%
          </Button>
          <Button size="sm" variant="outline" @click="progressValue = 100">
            100%
          </Button>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
