<script setup lang="ts">
import { ErrorPage, toast } from '@manfad99/ui'
import UsageExample from '../components/UsageExample.vue'
import { useEmbed } from '../use-embed'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.unauthorized
const isEmbed = useEmbed()
</script>

<template>
  <div :class="isEmbed ? '' : 'space-y-8'">
    <ErrorPage
      variant="unauthorized"
      @sign-in="toast.info({ title: 'Sign in requested' })"
      @back="toast.info({ title: 'Go back requested' })"
    />
    <UsageExample v-if="!isEmbed" :example="usage" />
  </div>
</template>
