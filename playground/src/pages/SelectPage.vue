<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.select
const selectedCountry = shallowRef<string | undefined>()
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Select</CardTitle>
        <CardDescription>
          Dropdown for choosing one option from a list.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <div class="space-y-2">
          <Label for="country-select">Country</Label>
          <Select v-model="selectedCountry">
            <SelectTrigger id="country-select">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="malaysia">Malaysia</SelectItem>
              <SelectItem value="singapore">Singapore</SelectItem>
              <SelectItem value="indonesia">Indonesia</SelectItem>
              <SelectItem value="thailand">Thailand</SelectItem>
              <SelectItem value="vietnam">Vietnam</SelectItem>
            </SelectContent>
          </Select>
          <p class="text-sm text-muted-foreground">
            Selected country: {{ selectedCountry ?? '—' }}
          </p>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
