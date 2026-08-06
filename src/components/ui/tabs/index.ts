import type { ComputedRef, InjectionKey } from 'vue'
import { cva, type VariantProps } from 'class-variance-authority'

export { default as Tabs } from './Tabs.vue'
export { default as TabsContent } from './TabsContent.vue'
export { default as TabsList } from './TabsList.vue'
export { default as TabsTrigger } from './TabsTrigger.vue'

const pillVariants = {
  default: 'data-[state=active]:text-primary-foreground',
  danger: 'data-[state=active]:text-destructive-foreground',
  success: 'data-[state=active]:text-success-foreground',
  warning: 'data-[state=active]:text-warning-foreground',
  outline: 'data-[state=active]:text-foreground',
  secondary: 'data-[state=active]:text-secondary-foreground',
  tertiary: 'data-[state=active]:text-tertiary-foreground',
  rival: 'data-[state=active]:text-rival-foreground',
  ghost: 'data-[state=active]:text-accent-foreground',
} as const

export const tabsListVariants = cva(
  'relative inline-flex items-center text-muted-foreground',
  {
    variants: {
      variant: {
        default: 'w-fit bg-muted p-[3px]',
        danger: 'w-fit bg-muted p-[3px]',
        success: 'w-fit bg-muted p-[3px]',
        warning: 'w-fit bg-muted p-[3px]',
        outline: 'w-fit bg-muted p-[3px]',
        secondary: 'w-fit bg-muted p-[3px]',
        tertiary: 'w-fit bg-muted p-[3px]',
        rival: 'w-fit bg-muted p-[3px]',
        ghost: 'w-fit bg-muted p-[3px]',
        underline: 'w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0',
      },
      square: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      ...Object.keys(pillVariants).flatMap(variant => [
        { variant: variant as keyof typeof pillVariants, square: true as const, class: 'rounded-md' },
        { variant: variant as keyof typeof pillVariants, square: false as const, class: 'rounded-full' },
      ]),
    ],
    defaultVariants: {
      variant: 'default',
      square: false,
    },
  },
)

export const tabsIndicatorVariants = cva(
  '',
  {
    variants: {
      square: {
        true: 'rounded-md',
        false: 'rounded-full',
      },
      variant: {
        default: 'h-full w-full bg-primary shadow-sm',
        danger: 'h-full w-full bg-destructive shadow-sm',
        success: 'h-full w-full bg-success shadow-sm',
        warning: 'h-full w-full bg-warning shadow-sm',
        outline: 'h-full w-full border border-input bg-background shadow-sm',
        secondary: 'h-full w-full bg-secondary shadow-sm',
        tertiary: 'h-full w-full bg-tertiary shadow-sm',
        rival: 'h-full w-full border border-rival-foreground/15 bg-rival shadow-sm',
        ghost: 'h-full w-full bg-accent shadow-sm',
        underline: 'h-0.5 w-full rounded-none bg-foreground shadow-none',
      },
    },
    defaultVariants: {
      square: false,
      variant: 'default',
    },
  },
)

export const tabsTriggerVariants = cva(
  'relative z-10 inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap text-sm font-medium outline-none transition-colors duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground',
  {
    variants: {
      square: {
        true: 'rounded-md',
        false: 'rounded-full',
      },
      variant: {
        default: `px-4 py-1 ${pillVariants.default}`,
        danger: `px-4 py-1 ${pillVariants.danger}`,
        success: `px-4 py-1 ${pillVariants.success}`,
        warning: `px-4 py-1 ${pillVariants.warning}`,
        outline: `px-4 py-1 ${pillVariants.outline}`,
        secondary: `px-4 py-1 ${pillVariants.secondary}`,
        tertiary: `px-4 py-1 ${pillVariants.tertiary}`,
        rival: `px-4 py-1 ${pillVariants.rival}`,
        ghost: `px-4 py-1 ${pillVariants.ghost}`,
        underline: 'rounded-none px-0 py-2.5 data-[state=active]:font-semibold data-[state=active]:text-foreground',
      },
    },
    defaultVariants: {
      square: false,
      variant: 'default',
    },
  },
)

export type TabsListVariants = VariantProps<typeof tabsListVariants>
export type TabsIndicatorVariants = VariantProps<typeof tabsIndicatorVariants>
export type TabsTriggerVariants = VariantProps<typeof tabsTriggerVariants>
export type TabsVariant = NonNullable<TabsIndicatorVariants['variant']>

export interface TabsListContext {
  variant: TabsVariant
  square: boolean
}

export const tabsListContextKey: InjectionKey<ComputedRef<TabsListContext>> = Symbol('manfad-tabs-list')
