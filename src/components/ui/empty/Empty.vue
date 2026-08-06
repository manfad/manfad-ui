<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useSlots } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  icon?: string
  /** Optional illustration displayed instead of the icon tile. */
  image?: string
  imageAlt?: string
  title: string
  description?: string
  class?: HTMLAttributes['class']
}>(), {
  icon: 'i-lucide-inbox',
  imageAlt: '',
})

const slots = useSlots()
</script>

<template>
  <div :class="cn('flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-10 text-center', props.class)">
    <img
      v-if="props.image"
      :src="props.image"
      :alt="props.imageAlt"
      class="mb-2 h-32 w-auto max-w-full object-contain"
    >
    <div v-else class="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
      <span :class="cn('h-6 w-6 text-muted-foreground', props.icon)" aria-hidden="true" />
    </div>
    <p class="mt-3 text-base font-semibold">
      {{ props.title }}
    </p>
    <p v-if="props.description" class="max-w-sm text-sm text-muted-foreground">
      {{ props.description }}
    </p>
    <div v-if="slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>
