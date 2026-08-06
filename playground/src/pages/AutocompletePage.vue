<script setup lang="ts">
import { shallowRef } from 'vue'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.autocomplete
const selectedCity = shallowRef('')
const cityOptions = [
  'Kuching',
  'Miri',
  'Bintulu',
  'Sibu',
  'Kota Kinabalu',
  'Sandakan',
  'Tawau',
  'Lahad Datu',
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Autocomplete</CardTitle>
        <CardDescription>
          Typeahead input that filters a list of options.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <div class="space-y-2">
          <Label for="city-autocomplete">Malaysian city</Label>
          <Autocomplete
            id="city-autocomplete"
            v-model="selectedCity"
            :options="cityOptions"
            placeholder="Start typing a city"
          />
          <p class="text-sm text-muted-foreground">
            Selected city: {{ selectedCity || '—' }}
          </p>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
