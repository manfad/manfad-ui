<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Choice,
  type ChoiceOption,
} from '@/components/ui/choice'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.choice

const categories = shallowRef<string[]>(['fuel'])
const categoriesLabeled = shallowRef<string[]>(['fuel'])
const categoriesSeparator = shallowRef<string[]>(['fuel'])
const categoriesDisabled = shallowRef<string[]>(['fuel'])
const status = shallowRef<string[]>(['open'])
const statusDisabledOption = shallowRef<string[]>(['open'])

const categoryOptions: ChoiceOption[] = [
  { value: 'fine', label: 'Fine' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'maintenance', label: 'Maintenance' },
]

const statusOptions: ChoiceOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'closed', label: 'Closed' },
]

const statusOptionsWithDisabled: ChoiceOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress', disabled: true },
  { value: 'closed', label: 'Closed' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>variant="checkbox"</CardTitle>
        <CardDescription>
          Default multi-select option list built on Checkbox.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Choice
          v-model="categories"
          :options="categoryOptions"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ categories.join(', ') || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>variant="radio"</CardTitle>
        <CardDescription>
          Single-select option list built on Radio.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <Choice
          v-model="status"
          variant="radio"
          :options="statusOptions"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ status[0] || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>label</CardTitle>
        <CardDescription>
          Optional fieldset legend above the options.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Choice
          v-model="categoriesLabeled"
          label="Category"
          :options="categoryOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>separator</CardTitle>
        <CardDescription>
          Renders a divider line between each option.
        </CardDescription>
      </CardHeader>
      <CardContent class="max-w-xs">
        <Choice
          v-model="categoriesSeparator"
          label="Category"
          separator
          :options="categoryOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>disabled</CardTitle>
        <CardDescription>
          Disable the whole group, or mark individual options with <code class="text-xs">disabled</code>.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">disabled</p>
          <Choice
            v-model="categoriesDisabled"
            disabled
            label="Category"
            :options="categoryOptions"
          />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">option.disabled</p>
          <Choice
            v-model="statusDisabledOption"
            variant="radio"
            label="Status"
            :options="statusOptionsWithDisabled"
          />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
