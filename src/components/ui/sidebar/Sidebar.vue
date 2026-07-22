<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <aside :class="cn('flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground', props.class)">
    <div
      v-if="$slots.header"
      class="flex min-h-14 items-center border-b border-sidebar-border px-2 py-1"
    >
      <slot name="header" />
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto overscroll-none py-2">
      <slot />
    </div>
    <div
      v-if="$slots.footer"
      class="border-t border-sidebar-border p-4"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
