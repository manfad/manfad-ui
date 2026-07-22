<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  placeholder?: string
  // Fixed dark ink reads well on the white/bg-background surface in both
  // light and dark themes, so the pen colour is intentionally not theme-aware.
  penColor?: string
  lineWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sign here',
  penColor: '#1f2937',
  lineWidth: 2,
})

const emit = defineEmits<{
  change: []
}>()

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const empty = shallowRef(true)

let ctx: CanvasRenderingContext2D | null = null
let drawing = false
let lastX = 0
let lastY = 0
let lastMidX = 0
let lastMidY = 0
let resizeObserver: ResizeObserver | null = null

function getContext(): CanvasRenderingContext2D | null {
  if (!ctx && canvasRef.value)
    ctx = canvasRef.value.getContext('2d')
  return ctx
}

function applyStrokeStyle() {
  const c = getContext()
  if (!c)
    return
  c.strokeStyle = props.penColor
  c.lineWidth = props.lineWidth
  c.lineCap = 'round'
  c.lineJoin = 'round'
}

// Resize the bitmap to match the CSS size at the current devicePixelRatio,
// preserving any existing drawing by snapshotting before the resize.
function resizeCanvas() {
  const canvas = canvasRef.value
  const c = getContext()
  if (!canvas || !c)
    return

  const dpr = window.devicePixelRatio || 1
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  if (width === 0 || height === 0)
    return

  const nextWidth = Math.round(width * dpr)
  const nextHeight = Math.round(height * dpr)
  if (canvas.width === nextWidth && canvas.height === nextHeight)
    return

  const snapshot = empty.value ? null : document.createElement('canvas')
  if (snapshot) {
    snapshot.width = canvas.width
    snapshot.height = canvas.height
    snapshot.getContext('2d')?.drawImage(canvas, 0, 0)
  }

  canvas.width = nextWidth
  canvas.height = nextHeight
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  applyStrokeStyle()

  if (snapshot)
    c.drawImage(snapshot, 0, 0, width, height)
}

function pointFromEvent(event: PointerEvent): { x: number, y: number } {
  const canvas = canvasRef.value!
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function onPointerDown(event: PointerEvent) {
  const canvas = canvasRef.value
  const c = getContext()
  if (!canvas || !c)
    return

  drawing = true
  canvas.setPointerCapture(event.pointerId)
  const { x, y } = pointFromEvent(event)
  lastX = x
  lastY = y
  lastMidX = x
  lastMidY = y

  // Draw a dot so a tap without movement still leaves a mark.
  c.beginPath()
  c.moveTo(x, y)
  c.lineTo(x, y)
  c.stroke()

  if (empty.value)
    empty.value = false
}

function onPointerMove(event: PointerEvent) {
  if (!drawing)
    return
  const c = getContext()
  if (!c)
    return

  const { x, y } = pointFromEvent(event)
  // Midpoint chain: each curve runs from the previous midpoint to the new
  // midpoint with the previous raw point as control, so consecutive segments
  // share endpoints and the stroke stays continuous.
  const midX = (lastX + x) / 2
  const midY = (lastY + y) / 2
  c.beginPath()
  c.moveTo(lastMidX, lastMidY)
  c.quadraticCurveTo(lastX, lastY, midX, midY)
  c.stroke()
  lastX = x
  lastY = y
  lastMidX = midX
  lastMidY = midY
}

function onPointerUp(event: PointerEvent) {
  if (!drawing)
    return
  drawing = false
  canvasRef.value?.releasePointerCapture(event.pointerId)
  emit('change')
}

function clear() {
  const canvas = canvasRef.value
  const c = getContext()
  if (!canvas || !c)
    return
  c.save()
  c.setTransform(1, 0, 0, 1, 0, 0)
  c.clearRect(0, 0, canvas.width, canvas.height)
  c.restore()
  empty.value = true
}

function isEmpty(): boolean {
  return empty.value
}

function toDataURL(type?: string): string {
  return canvasRef.value?.toDataURL(type) ?? ''
}

onMounted(() => {
  applyStrokeStyle()
  resizeCanvas()
  if (canvasRef.value) {
    resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(canvasRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})

defineExpose({ clear, isEmpty, toDataURL })
</script>

<template>
  <div :class="cn('relative h-40 rounded-md border bg-background', props.class)">
    <canvas
      ref="canvas"
      class="block h-full w-full touch-none cursor-crosshair"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    />
    <span
      v-if="empty"
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-muted-foreground"
    >
      {{ props.placeholder }}
    </span>
  </div>
</template>
