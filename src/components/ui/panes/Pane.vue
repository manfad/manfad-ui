<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, inject, onBeforeUnmount, onMounted, useId, watch } from 'vue'
import { cn } from '@/lib/utils'
import { PANES_INJECTION_KEY } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  size?: number
  minSize?: number
  maxSize?: number
  class?: HTMLAttributes['class']
}>(), {
  minSize: 10,
  maxSize: 100,
})

const context = inject(PANES_INJECTION_KEY, null)
const id = useId()

const index = computed(() => context?.paneIds.value.indexOf(id) ?? -1)

const isLast = computed(() => {
  if (!context || index.value < 0)
    return true
  return index.value === context.paneIds.value.length - 1
})

const showResizeHandle = computed(() =>
  !!context?.resizable.value && !isLast.value && index.value >= 0,
)

const paneSize = computed(() => context?.getSize(id) ?? props.size ?? 100)

// flex-grow proportions share space after fixed resize handles.
const paneStyle = computed<CSSProperties>(() => ({
  flexGrow: paneSize.value,
  flexShrink: 1,
  flexBasis: '0px',
}))

const paneClass = computed(() => cn(
  'min-h-0 min-w-0 overflow-auto border bg-background',
  context?.square.value ? 'rounded-none' : 'rounded-md',
  props.class,
))

const handleClass = computed(() => cn(
  'relative shrink-0 touch-none select-none outline-none',
  'focus-visible:ring-2 focus-visible:ring-ring',
  'before:absolute before:bg-border',
  context?.variant.value === 'horizontal'
    ? 'w-2 cursor-col-resize before:inset-y-2 before:left-1/2 before:w-px before:-translate-x-1/2'
    : 'h-2 cursor-row-resize before:inset-x-2 before:top-1/2 before:h-px before:-translate-y-1/2',
))

onMounted(() => {
  context?.register({
    id,
    size: props.size,
    minSize: props.minSize,
    maxSize: props.maxSize,
  })
})

watch(
  () => [props.size, props.minSize, props.maxSize] as const,
  ([size, minSize, maxSize]) => {
    context?.updatePane(id, { size, minSize, maxSize })
  },
)

onBeforeUnmount(() => {
  context?.unregister(id)
})

function onPointerDown(event: PointerEvent) {
  if (!context || index.value < 0)
    return

  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.setPointerCapture(event.pointerId)

  const clientPos = context.variant.value === 'horizontal' ? event.clientX : event.clientY
  context.beginResize(index.value, clientPos)

  function onPointerMove(moveEvent: PointerEvent) {
    const pos = context!.variant.value === 'horizontal' ? moveEvent.clientX : moveEvent.clientY
    context!.moveResize(pos)
  }

  function onPointerUp(upEvent: PointerEvent) {
    context!.endResize()
    target.releasePointerCapture(upEvent.pointerId)
    target.removeEventListener('pointermove', onPointerMove)
    target.removeEventListener('pointerup', onPointerUp)
    target.removeEventListener('pointercancel', onPointerUp)
  }

  target.addEventListener('pointermove', onPointerMove)
  target.addEventListener('pointerup', onPointerUp)
  target.addEventListener('pointercancel', onPointerUp)
}

function onKeyDown(event: KeyboardEvent) {
  if (!context || index.value < 0)
    return

  const horizontal = context.variant.value === 'horizontal'
  const step = event.shiftKey ? 5 : 1

  if (horizontal && event.key === 'ArrowLeft') {
    event.preventDefault()
    context.nudgeResize(index.value, -step)
  }
  else if (horizontal && event.key === 'ArrowRight') {
    event.preventDefault()
    context.nudgeResize(index.value, step)
  }
  else if (!horizontal && event.key === 'ArrowUp') {
    event.preventDefault()
    context.nudgeResize(index.value, -step)
  }
  else if (!horizontal && event.key === 'ArrowDown') {
    event.preventDefault()
    context.nudgeResize(index.value, step)
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="paneClass"
    :style="paneStyle"
    data-slot="pane"
  >
    <slot />
  </div>

  <div
    v-if="showResizeHandle"
    role="separator"
    tabindex="0"
    :aria-orientation="context?.variant.value === 'horizontal' ? 'vertical' : 'horizontal'"
    :aria-valuenow="Math.round(paneSize)"
    :class="handleClass"
    data-slot="pane-resize-handle"
    @pointerdown="onPointerDown"
    @keydown="onKeyDown"
  />
</template>
