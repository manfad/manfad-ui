<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button, PageLoading } from '@manfad99/ui'
import UsageExample from '../components/UsageExample.vue'
import { useEmbed } from '../use-embed'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['page-loading']
const isEmbed = useEmbed()

const loading = shallowRef(false)
let timer: ReturnType<typeof setTimeout> | undefined

function simulateLoad() {
  loading.value = true
  clearTimeout(timer)
  timer = setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <!-- In showcase iframes, render the loading state directly. -->
  <PageLoading v-if="isEmbed" description="Fetching the latest data for this page." />

  <div v-else class="space-y-8">
    <PageLoading v-if="loading" description="Fetching the latest data for this page." />
    <div v-else class="flex min-h-[32rem] w-full flex-col items-center justify-center gap-4 rounded-xl border bg-background px-6 py-16 text-center">
      <p class="text-sm text-muted-foreground">
        Page content loaded. Replay to see the loading fallback again.
      </p>
      <Button variant="outline" @click="simulateLoad">
        <span class="i-lucide-play mr-2 size-4" aria-hidden="true" />
        Simulate page load
      </Button>
    </div>
    <UsageExample :example="usage" />
  </div>
</template>
