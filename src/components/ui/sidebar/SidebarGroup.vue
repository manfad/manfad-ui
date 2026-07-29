<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, shallowRef } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  label?: string
  /** Turns the label into a toggle. Needs a `label` to have something to click. */
  collapsible?: boolean
  /** Initial state when the group manages its own open state. */
  defaultOpen?: boolean
  /** Controlled state — pair with `v-model:open`, or `@update:open` alone. */
  open?: boolean
  class?: HTMLAttributes['class']
}>(), {
  collapsible: false,
  defaultOpen: true,
  // Vue casts an absent Boolean prop to `false` unless it declares a default,
  // which would make "uncontrolled" indistinguishable from "controlled, closed".
  open: undefined,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const uncontrolledOpen = shallowRef(props.defaultOpen)

// `open` left undefined means the group tracks its own state; passing it (with
// or without v-model) hands control to the parent.
const isOpen = computed(() => props.open ?? uncontrolledOpen.value)

const showTrigger = computed(() => props.collapsible && !!props.label)

function toggle(): void {
  const next = !isOpen.value
  uncontrolledOpen.value = next
  emit('update:open', next)
}

const headerClass = 'px-2 pb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground'
</script>

<template>
  <section :class="cn('px-3 py-2', props.class)">
    <button
      v-if="showTrigger"
      type="button"
      :class="cn('flex w-full items-center justify-between transition-colors hover:text-foreground', headerClass)"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span>{{ props.label }}</span>
      <span
        :class="cn('i-lucide-chevron-down h-3.5 w-3.5 shrink-0 transition-transform', !isOpen && '-rotate-90')"
        aria-hidden="true"
      />
    </button>
    <h2 v-else-if="props.label" :class="headerClass">
      {{ props.label }}
    </h2>
    <div v-show="!showTrigger || isOpen" class="flex flex-col gap-1">
      <slot />
    </div>
  </section>
</template>
