<script setup lang="ts">
import type { SelectRootEmits, SelectRootProps } from 'radix-vue'
import { SelectRoot, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<Omit<SelectRootProps, 'modelValue'>>()
const emits = defineEmits<Omit<SelectRootEmits, 'update:modelValue'>>()
const modelValue = defineModel<string>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SelectRoot v-model="modelValue" v-bind="forwarded">
    <slot />
  </SelectRoot>
</template>
