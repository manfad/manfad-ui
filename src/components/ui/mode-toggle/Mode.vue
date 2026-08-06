<script lang="ts">
export interface ModeProps {
  value: string
  /** Optional; defaults to the default slot text, then `value`. */
  label?: string
}
</script>

<script setup lang="ts">
/**
 * Declarative option for {@link ModeToggle}. Renders nothing — the parent
 * reads `value` / label from the VNode.
 */
defineOptions({ name: 'Mode' })
defineProps<ModeProps>()
</script>

<template>
  <slot />
</template>
