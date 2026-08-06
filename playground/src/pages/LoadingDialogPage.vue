<script setup lang="ts">
import { shallowRef } from 'vue'
import { useRoute } from 'vue-router'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, LoadingDialog } from '@manfad/ui'
import UsageExample from '../components/UsageExample.vue'
import { useEmbed } from '../use-embed'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['loading-dialog']
const route = useRoute()
const isEmbed = useEmbed()

// `?open=blocking|cancellable` lets showcase iframes load with a dialog visible.
const blockingOpen = shallowRef(route.query.open === 'blocking')
const cancellableOpen = shallowRef(route.query.open === 'cancellable')
</script>

<template>
  <div :class="isEmbed ? '' : 'space-y-8'">
    <Card>
      <CardHeader>
        <CardTitle>Loading dialog</CardTitle>
        <CardDescription>
          Blocking or cancellable progress for tasks that must keep the user’s focus.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap gap-3">
        <Button @click="blockingOpen = true">
          Show blocking dialog
        </Button>
        <Button variant="outline" @click="cancellableOpen = true">
          Show cancellable progress
        </Button>
      </CardContent>
    </Card>

    <LoadingDialog
      v-model:open="blockingOpen"
      title="Publishing changes"
      description="Please keep this window open while your changes are published."
    />
    <LoadingDialog
      v-model:open="cancellableOpen"
      title="Uploading files"
      description="You can cancel this upload and continue later."
      :progress="68"
      :blocking="false"
    />

    <UsageExample v-if="!isEmbed" :example="usage" />
  </div>
</template>
