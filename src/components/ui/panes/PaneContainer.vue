<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide, shallowRef, useTemplateRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import {
  PANES_INJECTION_KEY,
  resolvePaneSizes,
  resizePanePair,
  type PaneRegistration,
  type PanesVariant,
} from './context'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  variant?: PanesVariant
  resizable?: boolean
  square?: boolean
  /** When true, draws a border around the container. Off by default. */
  border?: boolean
  class?: HTMLAttributes['class']
}>(), {
  variant: 'vertical',
  resizable: false,
  square: false,
  border: false,
})

const sizesModel = defineModel<number[]>('sizes')
const localSizes = shallowRef<number[]>([])

const rootEl = useTemplateRef<HTMLElement>('root')
const panes = shallowRef<PaneRegistration[]>([])
const paneIds = computed(() => panes.value.map(pane => pane.id))

const isControlled = computed(() => sizesModel.value !== undefined)

const drag = shallowRef<{
  beforeIndex: number
  startPos: number
  startSizes: number[]
  containerSize: number
} | null>(null)

const activeSizes = computed(() => {
  if (isControlled.value)
    return sizesModel.value ?? null

  return localSizes.value.length === panes.value.length
    ? localSizes.value
    : null
})

const resolvedSizes = computed(() =>
  resolvePaneSizes(panes.value, activeSizes.value),
)

function setSizes(next: number[]) {
  if (isControlled.value)
    sizesModel.value = next
  else
    localSizes.value = next
}

function register(pane: PaneRegistration) {
  if (panes.value.some(entry => entry.id === pane.id))
    return
  panes.value = [...panes.value, pane]
}

function unregister(id: string) {
  panes.value = panes.value.filter(pane => pane.id !== id)
}

function updatePane(id: string, patch: Partial<Omit<PaneRegistration, 'id'>>) {
  panes.value = panes.value.map(pane =>
    pane.id === id ? { ...pane, ...patch } : pane,
  )
}

function getSize(id: string) {
  const index = panes.value.findIndex(pane => pane.id === id)
  if (index < 0)
    return 100
  return resolvedSizes.value[index] ?? 100
}

function measureContainer() {
  const el = rootEl.value
  if (!el)
    return 0

  const rect = el.getBoundingClientRect()
  const styles = getComputedStyle(el)
  const padding = props.variant === 'horizontal'
    ? Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)
    : Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom)

  const size = props.variant === 'horizontal' ? rect.width : rect.height
  return Math.max(0, size - padding)
}

function beginResize(beforeIndex: number, clientPos: number) {
  if (!props.resizable)
    return

  drag.value = {
    beforeIndex,
    startPos: clientPos,
    startSizes: [...resolvedSizes.value],
    containerSize: measureContainer(),
  }
}

function moveResize(clientPos: number) {
  const state = drag.value
  if (!state || state.containerSize <= 0)
    return

  const deltaPct = ((clientPos - state.startPos) / state.containerSize) * 100
  setSizes(resizePanePair(
    state.startSizes,
    panes.value,
    state.beforeIndex,
    deltaPct,
  ))
}

function endResize() {
  drag.value = null
}

function nudgeResize(beforeIndex: number, deltaPct: number) {
  if (!props.resizable)
    return

  setSizes(resizePanePair(
    resolvedSizes.value,
    panes.value,
    beforeIndex,
    deltaPct,
  ))
}

watch(
  panes,
  (list) => {
    if (list.length === 0 || isControlled.value)
      return

    if (localSizes.value.length !== list.length)
      localSizes.value = resolvePaneSizes(list, null)
  },
  { deep: true },
)

provide(PANES_INJECTION_KEY, {
  variant: computed(() => props.variant),
  resizable: computed(() => props.resizable),
  square: computed(() => props.square),
  paneIds,
  register,
  unregister,
  updatePane,
  getSize,
  beginResize,
  moveResize,
  endResize,
  nudgeResize,
})

const rootClass = computed(() => cn(
  'flex h-full min-h-0 bg-background p-2',
  props.border && 'border',
  props.square ? 'rounded-none' : 'rounded-md',
  props.variant === 'horizontal' ? 'flex-row' : 'flex-col',
  props.resizable ? 'gap-0' : 'gap-2',
  props.class,
))
</script>

<template>
  <div
    ref="root"
    v-bind="$attrs"
    :class="rootClass"
    data-slot="pane-container"
    :data-variant="props.variant"
    :data-resizable="props.resizable ? 'true' : undefined"
    :data-border="props.border ? 'true' : undefined"
  >
    <slot />
  </div>
</template>
