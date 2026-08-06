<script setup lang="ts">
import { RouterLink } from 'vue-router'

interface ShowcaseDemo {
  id: string
  label: string
  src: string
  note: string
  /** Route name for the "Open full page" link — defaults to `id`. */
  to?: string
}

const demos: ShowcaseDemo[] = [
  { id: 'error', label: 'Error', src: '/error?embed=1', note: 'variant="error" · 500' },
  { id: 'not-found', label: 'Not found', src: '/error?embed=1&variant=not-found', note: 'variant="not-found" · 404', to: 'error' },
  { id: 'unauthorized', label: 'Unauthorized', src: '/unauthorized?embed=1', note: 'variant="unauthorized" · 401' },
  { id: 'no-permission', label: 'No permission', src: '/no-permission?embed=1', note: 'variant="no-permission" · 403' },
  { id: 'page-loading', label: 'Page loading', src: '/page-loading?embed=1', note: 'spinner fallback while the page loads' },
  { id: 'loading-dialog', label: 'Loading dialog', src: '/loading-dialog?embed=1&open=cancellable', note: 'cancellable progress, open on load' },
]
</script>

<template>
  <div class="space-y-6">
    <p class="text-sm text-muted-foreground">
      All four states rendered live in isolated frames — fully interactive, each with its own
      document so overlays like the loading dialog stay contained. Open any state full-page
      to inspect it at viewport size.
    </p>

    <div class="grid gap-6 lg:grid-cols-2">
      <section
        v-for="demo in demos"
        :key="demo.id"
        class="overflow-hidden rounded-xl border bg-card shadow-sm"
      >
        <!-- Fake browser chrome -->
        <header class="flex items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
          <span class="flex shrink-0 gap-1.5" aria-hidden="true">
            <span class="size-2.5 rounded-full bg-destructive/60" />
            <span class="size-2.5 rounded-full bg-warning/60" />
            <span class="size-2.5 rounded-full bg-primary/50" />
          </span>
          <span class="min-w-0 flex-1 truncate rounded-md bg-background px-3 py-1 font-mono text-xs text-muted-foreground ring-1 ring-border">
            {{ demo.src }}
          </span>
          <RouterLink
            :to="{ name: demo.to ?? demo.id }"
            class="shrink-0 text-xs font-medium text-primary hover:underline"
          >
            Open full page
          </RouterLink>
        </header>

        <div class="flex items-baseline justify-between gap-3 px-4 pt-3">
          <h2 class="text-sm font-semibold">
            {{ demo.label }}
          </h2>
          <p class="truncate text-xs text-muted-foreground">
            {{ demo.note }}
          </p>
        </div>

        <iframe
          :src="demo.src"
          :title="`${demo.label} demo`"
          class="mt-3 block h-[34rem] w-full border-t bg-background"
          loading="lazy"
        />
      </section>
    </div>
  </div>
</template>
