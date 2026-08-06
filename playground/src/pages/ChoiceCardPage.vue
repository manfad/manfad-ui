<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChoiceCard,
  type ChoiceCardOption,
} from '@/components/ui/choice'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['choice-card']

const plan = shallowRef<string[]>(['plus'])
const planLabeled = shallowRef<string[]>(['pro'])
const planIndicatorEnd = shallowRef<string[]>(['pro'])
const planIndicatorStart = shallowRef<string[]>(['plus'])
const features = shallowRef<string[]>(['analytics'])
const featuresDisabled = shallowRef<string[]>(['analytics'])

const planOptions: ChoiceCardOption[] = [
  {
    value: 'plus',
    label: 'Plus',
    description: 'For individuals and small teams.',
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For growing businesses.',
  },
  {
    value: 'enterprise',
    label: 'Enterprise',
    description: 'For large teams and enterprises.',
  },
]

const featureOptions: ChoiceCardOption[] = [
  {
    value: 'analytics',
    label: 'Analytics',
    description: 'Track usage and performance.',
  },
  {
    value: 'automation',
    label: 'Automation',
    description: 'Trigger workflows from events.',
  },
  {
    value: 'support',
    label: 'Priority support',
    description: 'Faster response from the team.',
    disabled: true,
  },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>variant="radio"</CardTitle>
        <CardDescription>
          Default single-select cards. Selected state fills with primary.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex max-w-md flex-col gap-3">
        <ChoiceCard
          v-model="plan"
          :options="planOptions"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ plan[0] || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>variant="checkbox"</CardTitle>
        <CardDescription>
          Multi-select cards built on Checkbox.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex max-w-md flex-col gap-3">
        <ChoiceCard
          v-model="features"
          variant="checkbox"
          :options="featureOptions"
        />
        <p class="text-sm text-muted-foreground">
          Selected: {{ features.join(', ') || 'none' }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>label</CardTitle>
        <CardDescription>
          Optional fieldset legend above the cards.
        </CardDescription>
      </CardHeader>
      <CardContent class="max-w-md">
        <ChoiceCard
          v-model="planLabeled"
          label="Plan"
          :options="planOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>indicator</CardTitle>
        <CardDescription>
          Show the radio/checkbox control inside each card.
        </CardDescription>
      </CardHeader>
      <CardContent class="max-w-md">
        <ChoiceCard
          v-model="planIndicatorEnd"
          indicator
          :options="planOptions"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>position</CardTitle>
        <CardDescription>
          Place the indicator at <code class="text-xs">start</code> or <code class="text-xs">end</code> (default).
        </CardDescription>
      </CardHeader>
      <CardContent class="flex max-w-md flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">position="end"</p>
          <ChoiceCard
            v-model="planIndicatorEnd"
            indicator
            position="end"
            :options="planOptions"
          />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">position="start"</p>
          <ChoiceCard
            v-model="planIndicatorStart"
            indicator
            position="start"
            :options="planOptions"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>disabled</CardTitle>
        <CardDescription>
          Disable the whole group, or mark individual options with <code class="text-xs">disabled</code>.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex max-w-md flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">disabled</p>
          <ChoiceCard
            v-model="plan"
            disabled
            label="Plan"
            :options="planOptions"
          />
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">option.disabled</p>
          <ChoiceCard
            v-model="featuresDisabled"
            variant="checkbox"
            indicator
            position="start"
            label="Features"
            :options="featureOptions"
          />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
