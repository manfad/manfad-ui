import { reactive, readonly } from 'vue'

export type ToastVariant = 'default' | 'success' | 'warning' | 'destructive' | 'info'

export interface ToastActionOption {
  /** Label rendered on the action button. */
  label: string
  /** Called when the action button is activated. */
  onClick: () => void
}

export interface ToastOptions {
  title?: string
  description?: string
  variant?: ToastVariant
  /** Auto-dismiss delay in milliseconds. Defaults to 5000. */
  duration?: number
  action?: ToastActionOption
}

export interface ToastItem extends ToastOptions {
  id: string
  open: boolean
}

/** Maximum number of toasts shown at once; older toasts are evicted. */
const TOAST_LIMIT = 3
const DEFAULT_DURATION = 5000
/** Grace period so the exit animation can finish before unmount. */
const REMOVE_DELAY = 200

interface ToastState {
  toasts: ToastItem[]
}

const state = reactive<ToastState>({
  toasts: [],
})

let count = 0
function genId(): string {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return `${Date.now()}-${count}`
}

const removalTimers = new Map<string, ReturnType<typeof setTimeout>>()

function removeToast(id: string) {
  const timer = removalTimers.get(id)
  if (timer) {
    clearTimeout(timer)
    removalTimers.delete(id)
  }
  const index = state.toasts.findIndex(t => t.id === id)
  if (index !== -1)
    state.toasts.splice(index, 1)
}

/**
 * Dismiss a toast. Flips `open` to false so the exit animation can play, then
 * removes it from the list once the animation has had time to run. Radix's
 * ToastRoot owns the auto-dismiss timer and calls this via `update:open`.
 */
function dismiss(id?: string) {
  if (id === undefined) {
    state.toasts.slice().forEach(t => dismiss(t.id))
    return
  }
  const item = state.toasts.find(t => t.id === id)
  if (!item || removalTimers.has(id))
    return
  item.open = false
  removalTimers.set(id, setTimeout(() => removeToast(id), REMOVE_DELAY))
}

export interface ToastHandle {
  id: string
  dismiss: () => void
  update: (opts: Partial<ToastOptions>) => void
}

function create(opts: ToastOptions): ToastHandle {
  const id = genId()

  const item: ToastItem = {
    id,
    open: true,
    variant: 'default',
    ...opts,
    duration: opts.duration ?? DEFAULT_DURATION,
  }

  state.toasts.unshift(item)

  // Evict overflow beyond the limit, oldest first.
  while (state.toasts.length > TOAST_LIMIT)
    removeToast(state.toasts[state.toasts.length - 1].id)

  return {
    id,
    dismiss: () => dismiss(id),
    update: (next) => {
      const current = state.toasts.find(t => t.id === id)
      if (current)
        Object.assign(current, next)
    },
  }
}

export interface ToastFn {
  (opts: ToastOptions): ToastHandle
  success: (opts: Omit<ToastOptions, 'variant'>) => ToastHandle
  error: (opts: Omit<ToastOptions, 'variant'>) => ToastHandle
  warning: (opts: Omit<ToastOptions, 'variant'>) => ToastHandle
  info: (opts: Omit<ToastOptions, 'variant'>) => ToastHandle
}

export const toast = create as ToastFn
toast.success = opts => create({ ...opts, variant: 'success' })
toast.error = opts => create({ ...opts, variant: 'destructive' })
toast.warning = opts => create({ ...opts, variant: 'warning' })
toast.info = opts => create({ ...opts, variant: 'info' })

export function useToast() {
  return {
    toasts: readonly(state.toasts),
    toast,
    dismiss,
  }
}
