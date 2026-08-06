<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { inject, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { excelContextKey } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  icon?: string | false
  text?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  /** Comma-separated accept list. */
  accept?: string
  class?: HTMLAttributes['class']
}>(), {
  icon: 'i-lucide-upload',
  text: 'Import',
  variant: 'outline',
  size: 'sm',
  disabled: false,
  accept: '.xlsx,.xls,.csv',
})

const excel = inject(excelContextKey, null)
if (!excel)
  throw new Error('<ExcelImport> must be used inside <Excel>.')

const ctx = excel

const inputRef = shallowRef<HTMLInputElement | null>(null)
const busy = shallowRef(false)

function openPicker() {
  inputRef.value?.click()
}

async function onChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file)
    return

  busy.value = true
  try {
    await ctx.importFile(file)
  }
  finally {
    busy.value = false
  }
}
</script>

<template>
  <Button
    type="button"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled || busy"
    :class="cn(props.class)"
    v-bind="$attrs"
    @click="openPicker"
  >
    <span
      v-if="props.icon"
      :class="cn('size-4 shrink-0', props.text && 'mr-1.5', props.icon)"
      aria-hidden="true"
    />
    <span v-if="props.text">{{ props.text }}</span>
  </Button>
  <input
    ref="inputRef"
    type="file"
    class="hidden"
    :accept="props.accept"
    @change="onChange"
  >
</template>
