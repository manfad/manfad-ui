<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { TabsRoot } from 'radix-vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string>()
</script>

<template>
  <TabsRoot
    v-model="modelValue"
    v-bind="$attrs"
    :class="cn(props.class)"
  >
    <slot />
  </TabsRoot>
</template>
