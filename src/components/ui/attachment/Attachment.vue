<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  name: string
  size?: number
  progress?: number
  error?: string
  class?: HTMLAttributes['class']
}>()

const emit = defineEmits<{
  remove: []
}>()

function formatSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024)
    return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
}

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif', 'heic']
const DOC_EXTS = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'md']

const icon = computed(() => {
  const ext = props.name.split('.').pop()?.toLowerCase() ?? ''
  if (IMAGE_EXTS.includes(ext))
    return 'i-lucide-image'
  if (DOC_EXTS.includes(ext))
    return 'i-lucide-file-text'
  return 'i-lucide-file'
})

const showProgress = computed(
  () => props.progress !== undefined && props.progress < 100 && !props.error,
)

const formattedSize = computed(() =>
  props.size !== undefined ? formatSize(props.size) : undefined,
)
</script>

<template>
  <div
    :class="cn(
      'flex items-center gap-3 rounded-md border bg-background p-2.5',
      props.error && 'border-destructive/50 bg-destructive/5',
      props.class,
    )"
  >
    <div
      class="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-muted"
    >
      <span :class="cn(icon, 'h-4 w-4', props.error ? 'text-destructive' : 'text-muted-foreground')" />
    </div>

    <div class="min-w-0 flex-1">
      <p class="truncate text-sm font-medium leading-tight">
        {{ props.name }}
      </p>

      <p
        v-if="props.error"
        class="mt-0.5 truncate text-xs text-destructive"
      >
        {{ props.error }}
      </p>
      <p
        v-else-if="formattedSize"
        class="mt-0.5 text-xs text-muted-foreground"
      >
        {{ formattedSize }}
      </p>

      <div
        v-if="showProgress"
        class="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          class="h-full rounded-full bg-primary transition-all"
          :style="{ width: `${Math.max(0, Math.min(100, props.progress!))}%` }"
        />
      </div>
    </div>

    <button
      type="button"
      aria-label="Remove attachment"
      class="inline-flex h-7 w-7 flex-none items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="emit('remove')"
    >
      <span class="i-lucide-x h-4 w-4" />
    </button>
  </div>
</template>
