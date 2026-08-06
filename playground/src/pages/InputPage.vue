<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  inputGroupInputClass,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.input
const inputValue = shallowRef('')
const amount = shallowRef('')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Input</CardTitle>
        <CardDescription>
          Text field with v-model binding.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-6">
        <div class="space-y-2">
          <Label for="preview-input">Preview value</Label>
          <Input
            id="preview-input"
            v-model="inputValue"
            placeholder="Type something to preview v-model"
          />
          <p class="text-sm text-muted-foreground">Typed value: {{ inputValue }}</p>
        </div>

        <div class="space-y-2">
          <Label for="amount-input">Amount</Label>
          <InputGroup>
            <InputGroupAddon side="leading">RM</InputGroupAddon>
            <Input
              id="amount-input"
              v-model="amount"
              :class="inputGroupInputClass"
              inputmode="decimal"
              placeholder="0.00"
            />
          </InputGroup>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
