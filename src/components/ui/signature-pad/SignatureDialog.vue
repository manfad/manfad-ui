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

export interface SignatureDialogProps {
  class?: HTMLAttributes['class']
  title?: string
  description?: string
  filename?: string
  download?: boolean
}

const props = withDefaults(defineProps<SignatureDialogProps>(), {
  title: 'Add signature',
  description: 'Draw your signature below.',
  filename: 'signature.png',
  download: true,
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

  const dataUrl = pad.toDataURL('image/png')
  if (props.download) {
    const filename = props.filename.toLowerCase().endsWith('.png')
      ? props.filename
      : `${props.filename}.png`
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.append(link)
    link.click()
    link.remove()
  }

  emit('save', dataUrl)
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
      <SignaturePad ref="pad" controls="none" @change="syncEmpty" />
      <DialogFooter>
        <Button class="sm:mr-auto" variant="ghost" :disabled="empty" @click="clear">
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
