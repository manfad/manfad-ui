<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, inject, nextTick, onMounted, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { cn } from '@/lib/utils'
import type { WheelOption } from './context'
import {
  WHEEL_PICKER_INJECTION_KEY,
  WHEEL_PICKER_ITEM_HEIGHT,
  WHEEL_PICKER_VISIBLE_COUNT,
} from './context'
import { useWheelScroll } from './useWheelScroll'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  options: Array<string | WheelOption>
  loop?: boolean
  class?: HTMLAttributes['class']
  'aria-label'?: string
}>(), {
  loop: false,
})

const modelValue = defineModel<string>()

const ctx = inject(WHEEL_PICKER_INJECTION_KEY, {
  itemHeight: computed(() => WHEEL_PICKER_ITEM_HEIGHT),
  visibleCount: computed(() => WHEEL_PICKER_VISIBLE_COUNT),
})
const itemHeight = ctx.itemHeight
const visibleCount = ctx.visibleCount
const columnId = useId()

const normalized = computed<WheelOption[]>(() =>
  props.options.map(option =>
    typeof option === 'string'
      ? { value: option, label: option, disabled: false }
      : { value: option.value, label: option.label ?? option.value, disabled: !!option.disabled },
  ),
)

const count = computed(() => normalized.value.length)
const copyOffset = computed(() => (props.loop ? count.value : 0))
// Loop renders the option list three times; the middle copy is the resting zone.
const rendered = computed<Array<WheelOption & { renderIndex: number, realIndex: number }>>(() => {
  const copies = props.loop ? 3 : 1
  const out: Array<WheelOption & { renderIndex: number, realIndex: number }> = []
  for (let copy = 0; copy < copies; copy += 1) {
    normalized.value.forEach((option, realIndex) => {
      out.push({ ...option, realIndex, renderIndex: out.length })
    })
  }
  return out
})

const scroller = useTemplateRef<HTMLElement>('scroller')
// The row visually nearest the center; drives bold styling during a scroll.
const liveIndex = shallowRef(0)

const selectedIndex = computed(() => {
  const index = normalized.value.findIndex(option => option.value === modelValue.value)
  return index === -1 ? 0 : index
})

const padStyle = computed<CSSProperties>(() => ({
  paddingTop: `${(visibleCount.value - 1) / 2 * itemHeight.value}px`,
  paddingBottom: `${(visibleCount.value - 1) / 2 * itemHeight.value}px`,
}))

const itemStyle = computed<CSSProperties>(() => ({ height: `${itemHeight.value}px` }))

// Nearest non-disabled option to `index`, searching outward; falls back to
// `index` if every option is disabled.
function nearestEnabled(index: number): number {
  const opts = normalized.value
  const n = opts.length
  if (n === 0 || !opts[index]?.disabled)
    return index

  for (let distance = 1; distance < n; distance += 1) {
    const down = props.loop ? (index + distance) % n : index + distance
    if (down < n && !opts[down]?.disabled)
      return down
    const up = props.loop ? ((index - distance) % n + n) % n : index - distance
    if (up >= 0 && !opts[up]?.disabled)
      return up
  }
  return index
}

const { scrollToReal, handleScroll } = useWheelScroll(scroller, {
  itemHeight,
  count,
  loop: () => props.loop,
  onScroll: (index) => {
    liveIndex.value = index
  },
  onSettle: (centered) => {
    const target = nearestEnabled(centered)
    liveIndex.value = target
    const option = normalized.value[target]
    if (option && option.value !== modelValue.value)
      modelValue.value = option.value
    return target
  },
})

function selectReal(index: number, smooth = true) {
  if (count.value === 0)
    return
  const target = props.loop
    ? ((index % count.value) + count.value) % count.value
    : Math.min(Math.max(index, 0), count.value - 1)

  const option = normalized.value[target]
  if (!option || option.disabled)
    return
  liveIndex.value = target
  modelValue.value = option.value
  scrollToReal(target, smooth)
}

function onKeydown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectReal(liveIndex.value + 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectReal(liveIndex.value - 1)
      break
    case 'Home':
      event.preventDefault()
      selectReal(0)
      break
    case 'End':
      event.preventDefault()
      selectReal(count.value - 1)
      break
  }
}

onMounted(() => {
  liveIndex.value = selectedIndex.value
  nextTick(() => scrollToReal(selectedIndex.value, false))
})

// Keep the wheel aligned when the value is changed from outside.
watch(modelValue, () => {
  if (selectedIndex.value !== liveIndex.value)
    scrollToReal(selectedIndex.value, true)
})

const maskStyle: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
  WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)',
}
</script>

<template>
  <div
    ref="scroller"
    role="listbox"
    tabindex="0"
    :aria-label="props['aria-label']"
    :aria-activedescendant="`${columnId}-opt-${selectedIndex}`"
    v-bind="$attrs"
    :class="cn('wheel-scroller flex-1 overflow-y-auto text-center outline-none focus-visible:ring-2 focus-visible:ring-ring', props.class)"
    :style="[padStyle, maskStyle]"
    @scroll="handleScroll"
    @keydown="onKeydown"
  >
    <div
      v-for="item in rendered"
      :id="item.renderIndex === selectedIndex + copyOffset ? `${columnId}-opt-${item.realIndex}` : undefined"
      :key="item.renderIndex"
      role="option"
      :aria-selected="item.realIndex === selectedIndex"
      :class="cn(
        'wheel-item flex select-none items-center justify-center px-3 text-sm tabular-nums transition-colors',
        item.realIndex === liveIndex ? 'font-medium text-foreground' : 'text-muted-foreground',
        item.disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer',
      )"
      :style="itemStyle"
      @click="selectReal(item.realIndex)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<style scoped>
.wheel-scroller {
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.wheel-scroller::-webkit-scrollbar {
  display: none;
}
.wheel-item {
  scroll-snap-align: center;
}
</style>
