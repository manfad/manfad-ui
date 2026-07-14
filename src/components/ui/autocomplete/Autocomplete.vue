<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  options: string[]
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string>({ default: '' })
const isFocused = shallowRef(false)
const isOpen = shallowRef(false)
const highlightedIndex = shallowRef(-1)
let blurTimer: ReturnType<typeof setTimeout> | undefined

const typedValue = computed(() => modelValue.value ?? '')
const normalizedValue = computed(() => typedValue.value.toLowerCase())

const firstMatch = computed(() => {
  if (!typedValue.value)
    return undefined

  return props.options.find(option => option.toLowerCase().startsWith(normalizedValue.value))
})

const ghostRemainder = computed(() => {
  if (!firstMatch.value)
    return ''

  return firstMatch.value.slice(typedValue.value.length)
})

const filteredOptions = computed(() => {
  const startsWithMatches: string[] = []
  const includesMatches: string[] = []
  const seen = new Set<string>()

  for (const option of props.options) {
    if (seen.has(option))
      continue

    const normalizedOption = option.toLowerCase()
    if (normalizedOption.startsWith(normalizedValue.value)) {
      startsWithMatches.push(option)
      seen.add(option)
    }
    else if (normalizedOption.includes(normalizedValue.value)) {
      includesMatches.push(option)
      seen.add(option)
    }
  }

  return [...startsWithMatches, ...includesMatches].slice(0, 8)
})

const showGhost = computed(() => isFocused.value && ghostRemainder.value.length > 0)

function clearBlurTimer() {
  if (blurTimer !== undefined) {
    clearTimeout(blurTimer)
    blurTimer = undefined
  }
}

function openDropdown() {
  clearBlurTimer()
  isFocused.value = true
  isOpen.value = true
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
}

function handleInput() {
  isOpen.value = true
  highlightedIndex.value = filteredOptions.value.length > 0 ? 0 : -1
}

function handleBlur() {
  isFocused.value = false
  blurTimer = setTimeout(() => {
    isOpen.value = false
    highlightedIndex.value = -1
    blurTimer = undefined
  }, 150)
}

function selectOption(option: string) {
  clearBlurTimer()
  modelValue.value = option
  isOpen.value = false
  highlightedIndex.value = -1
}

function acceptGhost() {
  if (firstMatch.value)
    selectOption(firstMatch.value)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Tab' && showGhost.value) {
    acceptGhost()
    return
  }

  if (event.key === 'ArrowRight' && showGhost.value) {
    const input = event.currentTarget as HTMLInputElement
    if (input.selectionStart === typedValue.value.length && input.selectionEnd === typedValue.value.length) {
      event.preventDefault()
      acceptGhost()
    }
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    isOpen.value = true
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = highlightedIndex.value >= filteredOptions.value.length - 1
        ? 0
        : highlightedIndex.value + 1
    }
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    isOpen.value = true
    if (filteredOptions.value.length > 0) {
      highlightedIndex.value = highlightedIndex.value <= 0
        ? filteredOptions.value.length - 1
        : highlightedIndex.value - 1
    }
    return
  }

  if (event.key === 'Enter' && isOpen.value && highlightedIndex.value >= 0) {
    const option = filteredOptions.value[highlightedIndex.value]
    if (option) {
      event.preventDefault()
      selectOption(option)
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

onBeforeUnmount(clearBlurTimer)
</script>

<template>
  <div
    :class="cn('relative w-full rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2', props.class)"
  >
    <div
      v-if="showGhost"
      class="pointer-events-none absolute inset-0 z-0 flex h-10 w-full items-center px-3 py-2 text-sm text-muted-foreground"
      aria-hidden="true"
    >
      <span class="invisible whitespace-pre">{{ typedValue }}</span><span class="text-foreground/50">{{ ghostRemainder }}</span>
    </div>
    <input
      v-model="modelValue"
      v-bind="$attrs"
      type="text"
      autocomplete="off"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      role="combobox"
      :aria-expanded="isOpen && filteredOptions.length > 0"
      aria-autocomplete="both"
      class="relative z-10 flex h-10 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
      @focus="openDropdown"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
    >
    <div
      v-if="isOpen && filteredOptions.length"
      role="listbox"
      class="absolute left-0 top-full z-50 mt-1 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
    >
      <div
        v-for="(option, index) in filteredOptions"
        :key="option"
        role="option"
        :aria-selected="index === highlightedIndex"
        :class="cn('cursor-pointer rounded-sm px-2 py-1.5 text-sm', index === highlightedIndex && 'bg-accent text-accent-foreground')"
        @mouseenter="highlightedIndex = index"
        @click="selectOption(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
