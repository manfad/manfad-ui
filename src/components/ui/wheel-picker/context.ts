import type { ComputedRef, InjectionKey } from 'vue'

export interface WheelPickerContext {
  /** Height of a single row in pixels (reactive). */
  itemHeight: ComputedRef<number>
  /** Number of visible rows; should be odd so one is centered (reactive). */
  visibleCount: ComputedRef<number>
}

export const WHEEL_PICKER_INJECTION_KEY: InjectionKey<WheelPickerContext>
  = Symbol('manfad-wheel-picker')

export const WHEEL_PICKER_ITEM_HEIGHT = 32
export const WHEEL_PICKER_VISIBLE_COUNT = 5

export interface WheelOption {
  value: string
  label?: string
  disabled?: boolean
}
