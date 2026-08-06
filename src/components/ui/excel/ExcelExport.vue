<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { excelContextKey, type ExcelFormat } from './types'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  format?: ExcelFormat
  icon?: string | false
  text?: string
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  class?: HTMLAttributes['class']
}>(), {
  format: 'xlsx',
  icon: 'i-lucide-download',
  text: 'Export',
  variant: 'outline',
  size: 'sm',
  disabled: false,
})

const excel = inject(excelContextKey, null)
if (!excel)
  throw new Error('<ExcelExport> must be used inside <Excel>.')

const ctx = excel

function onClick() {
  ctx.exportFile(props.format)
}
</script>

<template>
  <Button
    type="button"
    :variant="props.variant"
    :size="props.size"
    :disabled="props.disabled"
    :class="cn(props.class)"
    v-bind="$attrs"
    @click="onClick"
  >
    <span
      v-if="props.icon"
      :class="cn('size-4 shrink-0', props.text && 'mr-1.5', props.icon)"
      aria-hidden="true"
    />
    <span v-if="props.text">{{ props.text }}</span>
  </Button>
</template>
