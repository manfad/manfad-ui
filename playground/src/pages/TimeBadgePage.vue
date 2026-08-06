<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeBadge } from '@/components/ui/time-badge'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['time-badge']

const now = Date.now()
const fiveMinutesAgo = now - 5 * 60 * 1000
const twoHoursAgo = now - 2 * 60 * 60 * 1000
const yesterday = now - 24 * 60 * 60 * 1000
const lastMonth = now - 32 * 24 * 60 * 60 * 1000
const nineWeeksAgo = now - 62 * 24 * 60 * 60 * 1000
const inTenMinutes = now + 10 * 60 * 1000
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>TimeBadge</CardTitle>
        <CardDescription>
          Relative time badge. Use
          <code class="text-xs">short</code>
          for compact units and
          <code class="text-xs">icon</code>
          for a leading clock.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-2">
        <TimeBadge :time="nineWeeksAgo" short icon />
        <TimeBadge :time="twoHoursAgo" short icon />
        <TimeBadge :time="yesterday" short icon />
        <TimeBadge :time="fiveMinutesAgo" short icon />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Props</CardTitle>
        <CardDescription>
          <code class="text-xs">short</code>
          and
          <code class="text-xs">icon</code>
          are optional; omit them for the full “time ago” string.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <TimeBadge :time="now" />
          <TimeBadge :time="twoHoursAgo" />
          <TimeBadge :time="yesterday" />
          <TimeBadge :time="inTenMinutes" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <TimeBadge :time="lastMonth" short />
          <TimeBadge :time="twoHoursAgo" icon />
          <TimeBadge :time="twoHoursAgo" short icon />
          <TimeBadge :time="twoHoursAgo" short :icon="'i-lucide-timer'" />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <TimeBadge :time="twoHoursAgo" short icon variant="secondary" />
          <TimeBadge :time="twoHoursAgo" short icon variant="warning" />
          <TimeBadge :time="twoHoursAgo" short icon variant="success" />
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
