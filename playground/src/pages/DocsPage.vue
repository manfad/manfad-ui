<script setup lang="ts">
import { MdView } from '@/components/ui/md-view'
import readme from '../../../README.md?raw'
</script>

<template>
  <article class="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
    <MdView :content="readme" />
  </article>
</template>
