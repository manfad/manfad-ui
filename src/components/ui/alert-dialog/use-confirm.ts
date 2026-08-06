import type { ButtonVariants } from '@/components/ui/button'
import { reactive, readonly } from 'vue'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  destructive?: boolean
}

interface ConfirmState {
  open: boolean
  title: string
  description?: string
  confirmText: string
  cancelText: string
  confirmVariant: ButtonVariants['variant']
  resolve: ((value: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  open: false,
  title: '',
  description: undefined,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'default',
  resolve: null,
})

function settle(value: boolean) {
  state.open = false
  const resolve = state.resolve
  state.resolve = null
  resolve?.(value)
}

/**
 * Imperatively open a confirmation dialog. Requires a `<Confirmation />`
 * host to be mounted once in the app. Resolves `true` when confirmed and
 * `false` when cancelled, dismissed via escape, or the overlay is clicked.
 */
export function confirm(options: ConfirmOptions): Promise<boolean> {
  // If a confirmation is already pending, resolve it as cancelled first.
  if (state.resolve) {
    settle(false)
  }

  return new Promise<boolean>((resolve) => {
    state.title = options.title
    state.description = options.description
    state.confirmText = options.confirmText ?? 'Confirm'
    state.cancelText = options.cancelText ?? 'Cancel'
    state.confirmVariant = options.destructive ? 'danger' : 'default'
    state.resolve = resolve
    state.open = true
  })
}

export function useConfirm() {
  return { confirm }
}

// Internal helpers for the Confirmation host component.
export const confirmState = readonly(state)

export function handleConfirm() {
  settle(true)
}

export function handleCancel() {
  settle(false)
}

export function handleOpenChange(open: boolean) {
  if (!open) {
    settle(false)
  }
}
