<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, provide, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import { ROW_INJECTION_KEY } from './context'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const mainElements = new Set<HTMLElement>()
const currentMain = shallowRef<HTMLElement | null>(null)
const mainHeight = shallowRef<number | null>(null)

function registerMain(el: HTMLElement, register: boolean) {
  if (register) {
    if (import.meta.env.DEV && mainElements.size > 0 && !mainElements.has(el)) {
      console.warn(
        '[manfad/ui] Row: multiple main RowItems registered; using the first one.',
      )
    }
    mainElements.add(el)
  }
  else {
    mainElements.delete(el)
  }
  // First registered main wins.
  const next = mainElements.values().next()
  currentMain.value = next.done ? null : next.value
}

let observer: ResizeObserver | null = null

watch(currentMain, (el) => {
  observer?.disconnect()
  observer = null

  if (!el) {
    mainHeight.value = null
    return
  }

  mainHeight.value = el.offsetHeight

  if (typeof ResizeObserver === 'undefined')
    return

  observer = new ResizeObserver(() => {
    mainHeight.value = el.offsetHeight
  })
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

provide(ROW_INJECTION_KEY, { mainHeight, registerMain })

const style = computed<CSSProperties>(() =>
  mainHeight.value != null
    ? { '--manfad-row-main-height': `${mainHeight.value}px` } as CSSProperties
    : {},
)
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('flex w-full min-w-0 flex-row items-start gap-4', props.class)"
    :style="style"
  >
    <slot />
  </div>
</template>
