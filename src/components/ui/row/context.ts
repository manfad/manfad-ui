import type { InjectionKey, Ref } from 'vue'

export interface RowContext {
  /** Measured offsetHeight of the active main item, or null when unknown. */
  mainHeight: Ref<number | null>
  /** Register (or unregister) a RowItem's root element as a main candidate. */
  registerMain: (el: HTMLElement, register: boolean) => void
}

export const ROW_INJECTION_KEY: InjectionKey<RowContext> = Symbol('yf-row')
