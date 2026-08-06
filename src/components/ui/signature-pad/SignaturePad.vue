<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SignaturePadControls = 'none' | 'top' | 'bottom' | 'left' | 'right'

export interface SignaturePadProps {
  class?: HTMLAttributes['class']
  canvasClass?: HTMLAttributes['class']
  placeholder?: string
  // Fixed dark ink reads well on the white/bg-background surface in both
  // light and dark themes, so the pen colour is intentionally not theme-aware.
  penColor?: string
  lineWidth?: number
  controls?: SignaturePadControls
  filename?: string
  download?: boolean
}

const props = withDefaults(defineProps<SignaturePadProps>(), {
  placeholder: 'Sign here',
  penColor: '#1f2937',
  lineWidth: 2,
  controls: 'bottom',
  filename: 'signature.png',
  download: true,
})

const emit = defineEmits<{
  change: []
  save: [dataUrl: string]
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

const controlsAreVertical = computed(() => props.controls === 'left' || props.controls === 'right')
const controlsComeFirst = computed(() => props.controls === 'top' || props.controls === 'left')

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
  emit('change')
}

function isEmpty(): boolean {
  return empty.value
}

function toDataURL(type?: string): string {
  return canvasRef.value?.toDataURL(type) ?? ''
}

function save(): string {
  if (empty.value)
    return ''

  const dataUrl = toDataURL('image/png')
  if (props.download) {
    const filename = props.filename.toLowerCase().endsWith('.png')
      ? props.filename
      : `${props.filename}.png`
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
  }

  emit('save', dataUrl)
  return dataUrl
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

defineExpose({ clear, isEmpty, save, toDataURL })
</script>

<template>
  <div
    :class="cn(
      'flex w-full gap-2',
      controlsAreVertical ? 'flex-row' : 'flex-col',
      props.class,
    )"
  >
    <div
      :class="cn(
        'relative h-40 min-w-0 flex-1 rounded-md border bg-background',
        controlsComeFirst && 'order-2',
        props.canvasClass,
      )"
    >
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

    <div
      v-if="props.controls !== 'none'"
      :class="cn(
        'flex justify-between gap-2',
        controlsAreVertical ? 'flex-col' : 'flex-row',
        controlsComeFirst && 'order-1',
      )"
    >
      <Button type="button" variant="ghost" :disabled="empty" @click="clear">
        Clear
      </Button>
      <Button type="button" :disabled="empty" @click="save">
        Save
      </Button>
    </div>
  </div>
</template>
