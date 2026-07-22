<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  allowNegative?: boolean
  min?: number
  max?: number
  step?: number
  class?: HTMLAttributes['class']
}>(), {
  allowNegative: false,
  step: 1,
})

const model = defineModel<number | null>()

// Internal string state so the field can hold in-progress values ("5.", "-")
// and be fully cleared to empty even when the numeric value is 0.
const display = ref('')

// Non-navigation keys that must always pass through.
const CONTROL_KEYS = new Set([
  'Backspace',
  'Delete',
  'Tab',
  'Escape',
  'Enter',
  'Home',
  'End',
  'ArrowLeft',
  'ArrowRight',
])

// Parse a display string to a number, or null when empty/incomplete.
function parse(str: string): number | null {
  if (str === '' || str === '-' || str === '.' || str === '-.')
    return null
  const n = Number(str)
  return Number.isNaN(n) ? null : n
}

// Keep the display in sync when the model is changed from the outside,
// without clobbering an in-progress entry the user is still typing.
watch(model, (value) => {
  if (value === null || value === undefined) {
    if (parse(display.value) !== null)
      display.value = ''
    return
  }
  if (parse(display.value) !== value)
    display.value = String(value)
}, { immediate: true })

// Strip everything except digits, an optional leading "-" (when allowed),
// and a single ".".
function sanitize(raw: string): string {
  const negative = props.allowNegative && raw.trimStart().startsWith('-')
  let s = raw.replace(/[^\d.]/g, '')
  const firstDot = s.indexOf('.')
  if (firstDot !== -1)
    s = `${s.slice(0, firstDot + 1)}${s.slice(firstDot + 1).replace(/\./g, '')}`
  return (negative ? '-' : '') + s
}

function isKeyAllowed(key: string, input: HTMLInputElement): boolean {
  if (/\d/.test(key))
    return true
  const value = input.value
  const selStart = input.selectionStart ?? value.length
  const selEnd = input.selectionEnd ?? value.length
  const remaining = value.slice(0, selStart) + value.slice(selEnd)
  if (key === '.')
    return !remaining.includes('.')
  if (key === '-')
    return props.allowNegative && selStart === 0 && !remaining.includes('-')
  return false
}

function commit(next: number) {
  // Trim floating-point noise from repeated stepping.
  const normalized = Number(next.toFixed(10))
  display.value = String(normalized)
  model.value = normalized
}

function stepBy(delta: number) {
  let next = (parse(display.value) ?? 0) + delta
  if (!props.allowNegative && next < 0)
    next = 0
  if (props.min !== undefined && next < props.min)
    next = props.min
  if (props.max !== undefined && next > props.max)
    next = props.max
  commit(next)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    stepBy(props.step)
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    stepBy(-props.step)
    return
  }
  if (CONTROL_KEYS.has(e.key) || e.ctrlKey || e.metaKey || e.altKey)
    return
  if (e.key.length === 1 && !isKeyAllowed(e.key, e.target as HTMLInputElement))
    e.preventDefault()
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  const clean = sanitize(target.value)
  if (target.value !== clean)
    target.value = clean
  display.value = clean
  model.value = parse(clean)
}

function onBlur() {
  const n = parse(display.value)
  display.value = n === null ? '' : String(n)
  model.value = n
}
</script>

<template>
  <input
    :value="display"
    v-bind="$attrs"
    inputmode="decimal"
    :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50', props.class)"
    @keydown="onKeydown"
    @input="onInput"
    @blur="onBlur"
  >
</template>
