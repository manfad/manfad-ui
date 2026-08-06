<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  progress?: number
  max?: number
  blocking?: boolean
  cancelLabel?: string
  class?: HTMLAttributes['class']
}>(), {
  title: 'Please wait',
  description: 'Your request is being processed.',
  max: 100,
  blocking: true,
  cancelLabel: 'Cancel',
})

const emit = defineEmits<{
  cancel: []
}>()

const open = defineModel<boolean>('open', { default: false })
const progressPercentage = computed(() => {
  if (props.progress === undefined || props.max <= 0)
    return 0
  return Math.round(Math.min(100, Math.max(0, (props.progress / props.max) * 100)))
})

function preventClose(event: Event) {
  if (props.blocking)
    event.preventDefault()
}

function cancel() {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent
      size="sm"
      :class="cn('w-[calc(100%-2rem)] gap-0 text-center', props.blocking && '[&>button]:hidden', props.class)"
      @escape-key-down="preventClose"
      @pointer-down-outside="preventClose"
      @interact-outside="preventClose"
    >
      <div class="flex flex-col items-center px-2 py-3" aria-live="polite" aria-busy="true">
        <div class="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <Spinner class="size-7" />
        </div>
        <DialogTitle class="mt-5">
          {{ props.title }}
        </DialogTitle>
        <DialogDescription class="mt-2 max-w-sm leading-6">
          {{ props.description }}
        </DialogDescription>

        <div v-if="props.progress !== undefined" class="mt-6 w-full text-left">
          <div class="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{{ progressPercentage }}%</span>
          </div>
          <Progress :model-value="props.progress" :max="props.max" />
        </div>

        <Button v-if="!props.blocking" variant="outline" class="mt-6" @click="cancel">
          {{ props.cancelLabel }}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
