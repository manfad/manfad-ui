<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import { ROW_INJECTION_KEY } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  main?: boolean
  width?: string
  class?: HTMLAttributes['class']
}>()

const context = inject(ROW_INJECTION_KEY, null)
const el = useTemplateRef<HTMLElement>('el')

function register(register: boolean) {
  if (context && el.value)
    context.registerMain(el.value, register)
}

onMounted(() => {
  if (props.main)
    register(true)
})

watch(() => props.main, (isMain) => {
  register(!!isMain)
})

onBeforeUnmount(() => {
  register(false)
})

const syncHeight = computed(() => !props.main && context?.mainHeight.value != null)

const classes = computed(() =>
  cn(
    'flex min-h-0 min-w-0 flex-1 flex-col gap-4',
    props.width && 'w-[var(--yf-row-width)] flex-none',
    !props.main && 'overflow-auto',
    syncHeight.value && 'h-[var(--yf-row-main-height)] max-h-[var(--yf-row-main-height)]',
    props.class,
  ),
)

const style = computed<CSSProperties>(() =>
  props.width
    ? { '--yf-row-width': props.width } as CSSProperties
    : {},
)
</script>

<template>
  <div
    ref="el"
    v-bind="$attrs"
    :class="classes"
    :style="style"
    :data-main="props.main ? 'true' : 'false'"
    :data-fixed-width="props.width ? 'true' : undefined"
    :data-sync-height="syncHeight ? 'true' : undefined"
  >
    <slot />
  </div>
</template>
