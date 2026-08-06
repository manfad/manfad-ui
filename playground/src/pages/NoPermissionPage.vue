<script setup lang="ts">
import { ErrorPage, toast } from '@manfad99/ui'
import UsageExample from '../components/UsageExample.vue'
import { useEmbed } from '../use-embed'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['no-permission']
const isEmbed = useEmbed()
</script>

<template>
  <div :class="isEmbed ? '' : 'space-y-8'">
    <ErrorPage
      variant="no-permission"
      @back="toast.info({ title: 'Go back requested' })"
      @request-access="toast.info({ title: 'Access request started' })"
    />
    <UsageExample v-if="!isEmbed" :example="usage" />
  </div>
</template>
