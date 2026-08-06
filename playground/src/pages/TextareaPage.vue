<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.textarea
const notesText = shallowRef('')
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Textarea</CardTitle>
        <CardDescription>
          Multi-line text input for longer notes and descriptions.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <Label for="notes-area">Notes</Label>
        <Textarea
          id="notes-area"
          v-model="notesText"
          rows="3"
          placeholder="Multi-line text…"
        />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
