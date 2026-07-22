<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const props = defineProps<{
  label?: string
  for?: string
  hint?: string
  error?: string
  required?: boolean
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <Label v-if="props.label" :for="props.for">
      {{ props.label }}
      <span v-if="props.required" class="text-destructive" aria-hidden="true">*</span>
    </Label>
    <slot />
    <p v-if="props.error" class="text-sm text-destructive">
      {{ props.error }}
    </p>
    <p v-else-if="props.hint" class="text-sm text-muted-foreground">
      {{ props.hint }}
    </p>
  </div>
</template>
