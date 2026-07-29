<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  label: string
  /** Initial state when the item manages its own open state. */
  defaultOpen?: boolean
  /** Controlled state — pair with `v-model:open`, or `@update:open` alone. */
  open?: boolean
  active?: boolean
  class?: HTMLAttributes['class']
}>(), {
  defaultOpen: false,
  // Vue casts an absent Boolean prop to `false` unless it declares a default,
  // which would make "uncontrolled" indistinguishable from "controlled, closed".
  open: undefined,
  active: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const uncontrolledOpen = shallowRef(props.defaultOpen)

const isOpen = computed(() => props.open ?? uncontrolledOpen.value)

function toggle(): void {
  const next = !isOpen.value
  uncontrolledOpen.value = next
  emit('update:open', next)
}
</script>

<template>
  <div :class="cn(props.class)">
    <button
      type="button"
      :aria-expanded="isOpen"
      :class="cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        props.active && 'bg-sidebar-accent text-sidebar-accent-foreground',
      )"
      @click="toggle"
    >
      <slot name="icon" />
      <span class="flex-1 text-left">{{ props.label }}</span>
      <span
        :class="cn('i-lucide-chevron-down h-3.5 w-3.5 shrink-0 transition-transform', !isOpen && '-rotate-90')"
        aria-hidden="true"
      />
    </button>
    <div v-show="isOpen" class="ml-5 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-2">
      <slot />
    </div>
  </div>
</template>
