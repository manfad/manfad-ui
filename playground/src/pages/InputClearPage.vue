<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputClear } from '@/components/ui/input-clear'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['input-clear']

const query = shallowRef<string | number>()
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Clearable input</CardTitle>
        <CardDescription>
          The clear action appears only while the input has a value.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <InputClear
          v-model="query"
          class="max-w-sm"
          start-icon="i-lucide-search"
          placeholder="Search expenses"
        />
        <p class="text-sm text-muted-foreground">
          Value: {{ query || 'empty' }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
