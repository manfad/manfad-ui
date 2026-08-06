<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Filter,
  type FilterOption,
} from '@/components/ui/filter'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.filter

const categories = shallowRef<string[]>(['fuel'])
const status = shallowRef<string[]>(['open'])

const categoryOptions: FilterOption[] = [
  { value: 'fine', label: 'Fine' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'other', label: 'Other' },
  { value: 'repair', label: 'Repair' },
  { value: 'road-tax', label: 'Road Tax' },
  { value: 'spare-part', label: 'Spare Part' },
]

const statusOptions: FilterOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Checkbox filter</CardTitle>
        <CardDescription>
          Popover shell wrapping Choice with multi-select.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-start gap-3">
        <Filter
          v-model="categories"
          label="Category"
          :options="categoryOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Radio filter</CardTitle>
        <CardDescription>
          Popover shell wrapping Choice with single-select.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-start gap-3">
        <Filter
          v-model="status"
          variant="radio"
          label="Status"
          :options="statusOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Controlled values</CardTitle>
      </CardHeader>
      <CardContent class="grid gap-2 text-sm sm:grid-cols-2">
        <p>
          <span class="text-muted-foreground">Categories:</span>
          {{ categories.join(', ') || 'all' }}
        </p>
        <p>
          <span class="text-muted-foreground">Status:</span>
          {{ status[0] || 'all' }}
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
