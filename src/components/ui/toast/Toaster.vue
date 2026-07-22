<script setup lang="ts">
import type { ToastVariant } from './use-toast'
import { ToastProvider } from 'radix-vue'
import Toast from './Toast.vue'
import ToastAction from './ToastAction.vue'
import ToastClose from './ToastClose.vue'
import ToastDescription from './ToastDescription.vue'
import ToastTitle from './ToastTitle.vue'
import ToastViewport from './ToastViewport.vue'
import { useToast } from './use-toast'

const { toasts, dismiss } = useToast()

const iconByVariant: Record<ToastVariant, string> = {
  default: '',
  success: 'i-lucide-circle-check',
  warning: 'i-lucide-triangle-alert',
  destructive: 'i-lucide-circle-x',
  info: 'i-lucide-info',
}

function onOpenChange(open: boolean, id: string) {
  if (!open)
    dismiss(id)
}
</script>

<template>
  <ToastProvider>
    <Toast
      v-for="item in toasts"
      :key="item.id"
      :variant="item.variant"
      :open="item.open"
      :duration="item.duration"
      @update:open="(open) => onOpenChange(open, item.id)"
    >
      <span
        v-if="item.variant && iconByVariant[item.variant]"
        :class="iconByVariant[item.variant]"
        class="mt-0.5 h-5 w-5 shrink-0"
      />
      <div class="flex-1 space-y-1">
        <ToastTitle v-if="item.title">
          {{ item.title }}
        </ToastTitle>
        <ToastDescription v-if="item.description">
          {{ item.description }}
        </ToastDescription>
      </div>
      <ToastAction
        v-if="item.action"
        :alt-text="item.action.label"
        @click="item.action.onClick"
      >
        {{ item.action.label }}
      </ToastAction>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
