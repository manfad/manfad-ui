<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.skeleton
const rows = [1, 2, 3, 4]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Skeleton</CardTitle>
        <CardDescription>
          Placeholder shapes shown while content is loading.
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-8">
        <section aria-label="Loading profile" aria-busy="true">
          <p class="mb-3 text-sm font-medium">
            Profile
          </p>
          <div class="flex items-center gap-3">
            <Skeleton class="size-10 shrink-0 rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-3/5 max-w-56" />
              <Skeleton class="h-3 w-2/5 max-w-40" />
            </div>
          </div>
        </section>

        <section aria-label="Loading article" aria-busy="true">
          <p class="mb-3 text-sm font-medium">
            Content card
          </p>
          <div class="overflow-hidden rounded-lg border">
            <Skeleton class="aspect-[16/7] w-full rounded-none" />
            <div class="space-y-3 p-4">
              <Skeleton class="h-5 w-2/3" />
              <div class="space-y-2">
                <Skeleton class="h-3 w-full" />
                <Skeleton class="h-3 w-11/12" />
                <Skeleton class="h-3 w-4/5" />
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Loading table" aria-busy="true">
          <p class="mb-3 text-sm font-medium">
            Table rows
          </p>
          <div class="overflow-hidden rounded-lg border">
            <div
              v-for="row in rows"
              :key="row"
              class="grid grid-cols-[minmax(0,1fr)_5rem] items-center gap-3 border-b p-4 last:border-b-0 sm:grid-cols-[2fr_1fr_5rem] sm:gap-4"
            >
              <div class="flex items-center gap-3">
                <Skeleton class="size-8 shrink-0 rounded-full" />
                <Skeleton class="h-4 w-full max-w-44" />
              </div>
              <Skeleton class="hidden h-4 w-full max-w-28 sm:block" />
              <Skeleton class="h-7 w-20" />
            </div>
          </div>
        </section>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
