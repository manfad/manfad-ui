<script setup lang="ts">
import type { ErrorPageVariant } from '@manfad/ui'
import { shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Button, ErrorPage, toast } from '@manfad/ui'
import UsageExample from '../components/UsageExample.vue'
import { useEmbed } from '../use-embed'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.error
const route = useRoute()
const isEmbed = useEmbed()

const variants: { value: ErrorPageVariant, label: string }[] = [
  { value: 'error', label: '500 Error' },
  { value: 'not-found', label: '404 Not found' },
  { value: 'unauthorized', label: '401 Unauthorized' },
  { value: 'no-permission', label: '403 No permission' },
]

const allowed = variants.map(v => v.value)
const variant = shallowRef<ErrorPageVariant>(
  allowed.includes(route.query.variant as ErrorPageVariant)
    ? route.query.variant as ErrorPageVariant
    : 'error',
)

watch(() => route.query.variant, (value) => {
  if (allowed.includes(value as ErrorPageVariant))
    variant.value = value as ErrorPageVariant
})
</script>

<template>
  <div :class="isEmbed ? '' : 'space-y-8'">
    <ErrorPage
      :variant="variant"
      @retry="toast.info({ title: 'Retry requested' })"
      @home="toast.info({ title: 'Go home requested' })"
      @back="toast.info({ title: 'Go back requested' })"
      @sign-in="toast.info({ title: 'Sign in requested' })"
      @request-access="toast.info({ title: 'Access request started' })"
    />

    <div v-if="!isEmbed" class="flex flex-wrap items-center justify-center gap-2">
      <Button
        v-for="option in variants"
        :key="option.value"
        size="sm"
        :variant="variant === option.value ? 'default' : 'outline'"
        @click="variant = option.value"
      >
        {{ option.label }}
      </Button>
    </div>

    <UsageExample v-if="!isEmbed" :example="usage" />
  </div>
</template>
