<script setup lang="ts">
import { MdView } from '@/components/ui/md-view'
import content from '../../../docs/getting-started/ai/llms-txt.md?raw'
</script>

<template>
  <article class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
    <MdView :content="content" />
  </article>
</template>
