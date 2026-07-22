<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { shallowRef, useTemplateRef, watch } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SignaturePad from './SignaturePad.vue'

interface Props {
  class?: HTMLAttributes['class']
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Add signature',
  description: 'Draw your signature below.',
})

const emit = defineEmits<{
  save: [dataUrl: string]
}>()

const open = defineModel<boolean>('open', { default: false })

const padRef = useTemplateRef<InstanceType<typeof SignaturePad>>('pad')
const empty = shallowRef(true)

function syncEmpty() {
  empty.value = padRef.value?.isEmpty() ?? true
}

function clear() {
  padRef.value?.clear()
  syncEmpty()
}

function save() {
  const pad = padRef.value
  if (!pad || pad.isEmpty())
    return
  emit('save', pad.toDataURL('image/png'))
  open.value = false
}

// Start from a blank pad every time the dialog opens.
watch(open, (isOpen) => {
  if (isOpen) {
    padRef.value?.clear()
    empty.value = true
  }
})
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent :class="props.class">
      <DialogHeader>
        <DialogTitle>{{ props.title }}</DialogTitle>
        <DialogDescription>{{ props.description }}</DialogDescription>
      </DialogHeader>
      <SignaturePad ref="pad" @change="syncEmpty" />
      <DialogFooter>
        <Button variant="ghost" :disabled="empty" @click="clear">
          Clear
        </Button>
        <Button variant="secondary" @click="open = false">
          Cancel
        </Button>
        <Button :disabled="empty" @click="save">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
