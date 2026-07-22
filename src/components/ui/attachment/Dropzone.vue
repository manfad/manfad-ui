<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { ref } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  accept?: string
  multiple?: boolean
  disabled?: boolean
  title?: string
  description?: string
  buttonLabel?: string
  class?: HTMLAttributes['class']
}>(), {
  multiple: true,
  disabled: false,
  title: 'Upload files',
  description: 'Drag and drop files here, or click to browse.',
  buttonLabel: 'Browse files',
})

const emit = defineEmits<{
  files: [files: File[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const dragDepth = ref(0)
const isDragging = ref(false)

function openPicker() {
  if (props.disabled)
    return
  inputRef.value?.click()
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled)
    return
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openPicker()
  }
}

function emitFiles(fileList: FileList | null) {
  if (!fileList || fileList.length === 0)
    return
  emit('files', Array.from(fileList))
}

function onInputChange(event: Event) {
  const input = event.target as HTMLInputElement
  emitFiles(input.files)
  input.value = ''
}

function onDragEnter(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
  dragDepth.value++
  isDragging.value = true
}

function onDragOver(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
}

function onDragLeave(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
  dragDepth.value = Math.max(0, dragDepth.value - 1)
  if (dragDepth.value === 0)
    isDragging.value = false
}

function onDrop(event: DragEvent) {
  if (props.disabled)
    return
  event.preventDefault()
  dragDepth.value = 0
  isDragging.value = false
  emitFiles(event.dataTransfer?.files ?? null)
}
</script>

<template>
  <div
    role="button"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled"
    :class="cn(
      'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-input p-10 text-center transition-colors',
      !props.disabled && 'cursor-pointer hover:bg-accent/40',
      isDragging && !props.disabled && 'border-primary bg-primary/5',
      props.disabled && 'cursor-not-allowed opacity-60',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      props.class,
    )"
    @click="openPicker"
    @keydown="onKeydown"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <input
      ref="inputRef"
      type="file"
      class="hidden"
      :accept="props.accept"
      :multiple="props.multiple"
      :disabled="props.disabled"
      @change="onInputChange"
    >

    <slot>
      <div class="grid h-12 w-12 place-items-center rounded-2xl bg-muted">
        <span class="i-lucide-cloud-upload h-6 w-6 text-muted-foreground" />
      </div>

      <div class="space-y-1">
        <p class="text-base font-semibold">
          {{ props.title }}
        </p>
        <p class="text-sm text-muted-foreground">
          {{ props.description }}
        </p>
      </div>

      <span
        class="pointer-events-none mt-1 inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium"
      >
        {{ props.buttonLabel }}
      </span>
    </slot>
  </div>
</template>
