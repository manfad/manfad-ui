<script lang="ts">
import type { VNode } from 'vue'
import { Comment, Fragment } from 'vue'
import Mode from './Mode.vue'

export interface ModeToggleOption {
  value: string
  label: string
}

function flatten(vnodes: VNode[] | null | undefined): VNode[] {
  const out: VNode[] = []
  for (const vnode of vnodes ?? []) {
    if (!vnode || vnode.type === Comment)
      continue
    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      out.push(...flatten(vnode.children as VNode[]))
      continue
    }
    out.push(vnode)
  }
  return out
}

function slotText(vnode: VNode): string {
  const children = vnode.children
  if (typeof children === 'string')
    return children.trim()

  if (Array.isArray(children)) {
    return children
      .map((child) => {
        if (typeof child === 'string')
          return child
        if (child && typeof child === 'object' && 'children' in child) {
          const nested = (child as VNode).children
          return typeof nested === 'string' ? nested : ''
        }
        return ''
      })
      .join('')
      .trim()
  }

  if (children && typeof children === 'object' && 'default' in children) {
    const nodes = (children as { default?: () => VNode[] }).default?.() ?? []
    return nodes
      .map(node => (typeof node.children === 'string' ? node.children : ''))
      .join('')
      .trim()
  }

  return ''
}

function isModeVNode(vnode: VNode): boolean {
  return vnode.type === Mode
    || (typeof vnode.type === 'object'
      && vnode.type !== null
      && 'name' in vnode.type
      && (vnode.type as { name?: string }).name === 'Mode')
}
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, useSlots } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  /** Letter key that cycles modes when pressed without a text field focused (e.g. `"d"`). */
  shortcut?: string
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string>({ required: true })
const slots = useSlots()

const options = computed<ModeToggleOption[]>(() =>
  flatten(slots.default?.() ?? [])
    .filter(isModeVNode)
    .map((vnode) => {
      const value = String(vnode.props?.value ?? '')
      const labelProp = vnode.props?.label
      const label = labelProp != null && String(labelProp) !== ''
        ? String(labelProp)
        : (slotText(vnode) || value)
      return { value, label }
    })
    .filter(option => option.value !== ''),
)

const active = computed(() =>
  options.value.find(option => option.value === modelValue.value) ?? options.value[0],
)

const shortcutLabel = computed(() => {
  if (!props.shortcut)
    return undefined
  return props.shortcut.length === 1 ? props.shortcut.toUpperCase() : props.shortcut
})

function cycle(): void {
  if (options.value.length < 2)
    return
  const index = options.value.findIndex(option => option.value === modelValue.value)
  const next = options.value[(index + 1) % options.value.length]
  if (next)
    modelValue.value = next.value
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement))
    return false
  const tag = target.tagName
  return tag === 'INPUT'
    || tag === 'TEXTAREA'
    || tag === 'SELECT'
    || target.isContentEditable
}

function onKeydown(event: KeyboardEvent): void {
  if (!props.shortcut)
    return
  if (event.metaKey || event.ctrlKey || event.altKey)
    return
  if (isTypingTarget(event.target))
    return
  if (event.key.toLowerCase() !== props.shortcut.toLowerCase())
    return

  event.preventDefault()
  cycle()
}

onMounted(() => {
  if (props.shortcut)
    window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <button
    type="button"
    :aria-label="`Switch mode, currently ${active?.label ?? ''}`"
    :class="cn(
      'inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      props.class,
    )"
    @click="cycle"
  >
    <span class="tabular-nums">{{ active?.label }}</span>
    <kbd
      v-if="shortcutLabel"
      class="pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground"
    >
      {{ shortcutLabel }}
    </kbd>
  </button>
</template>
