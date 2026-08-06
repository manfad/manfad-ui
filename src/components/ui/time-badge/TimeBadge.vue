<script setup lang="ts">
import type {
  UseTimeAgoMessages,
  UseTimeAgoUnit,
  UseTimeAgoUnitNamesDefault,
} from '@vueuse/core'
import type { HTMLAttributes } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { computed } from 'vue'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const shortMessages: UseTimeAgoMessages = {
  justNow: 'now',
  past: n => n,
  future: n => n,
  invalid: '',
  second: n => `${n}s`,
  minute: n => `${n}m`,
  hour: n => `${n}h`,
  day: n => `${n}d`,
  week: n => `${n}w`,
  month: n => `${n}mo`,
  year: n => `${n}y`,
}

export interface TimeBadgeProps {
  /** Date/time to format — `Date`, timestamp, or parseable string. */
  time: Date | number | string
  /** Badge color variant. */
  variant?: BadgeVariants['variant']
  /**
   * Leading icon. `true` uses the clock icon; pass an Iconify class to customize.
   * @default false
   */
  icon?: boolean | string
  /**
   * Compact units (`62d`, `3h`, `1w`) instead of “2 hours ago”.
   * @default false
   */
  short?: boolean
  /**
   * Maximum unit before showing the full date instead of relative time.
   * @see https://vueuse.org/core/useTimeAgo/
   */
  max?: UseTimeAgoUnitNamesDefault | number
  /** Formatter used when `max` is exceeded. */
  fullDateFormatter?: (date: Date) => string
  /** Localizable message strings / formatters. Overrides `short` messages when set. */
  messages?: UseTimeAgoMessages
  /** Include seconds in the relative string. */
  showSecond?: boolean
  /** Rounding method applied to unit values. */
  rounding?: 'round' | 'ceil' | 'floor' | number
  /** Custom time units. */
  units?: UseTimeAgoUnit[]
  /**
   * Auto-update interval in ms. Set `0` to disable.
   * @deprecated Prefer VueUse `scheduler`; kept for API parity.
   * @default 30_000
   */
  updateInterval?: number
  /**
   * Tooltip / accessible absolute time.
   * Pass `false` to omit the `title` attribute.
   * Defaults to a locale string of `time`.
   */
  title?: string | false
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<TimeBadgeProps>(), {
  variant: 'outline',
  icon: false,
  short: false,
  showSecond: false,
})

defineSlots<{
  default: (props: { timeAgo: string }) => unknown
}>()

const iconClass = computed(() => {
  if (props.icon === false || props.icon === undefined)
    return null
  if (props.icon === true)
    return 'i-lucide-clock'
  return props.icon
})

const timeAgo = useTimeAgo(() => props.time, {
  max: props.max,
  fullDateFormatter: props.fullDateFormatter,
  messages: props.messages ?? (props.short ? shortMessages : undefined),
  showSecond: props.showSecond,
  rounding: props.rounding,
  units: props.units,
  updateInterval: props.updateInterval,
})

const parsed = computed(() => {
  const date = props.time instanceof Date ? props.time : new Date(props.time)
  return Number.isNaN(date.getTime()) ? null : date
})

const datetime = computed(() => parsed.value?.toISOString())

const absoluteTitle = computed(() => {
  if (props.title === false)
    return undefined
  if (props.title !== undefined)
    return props.title
  return parsed.value?.toLocaleString()
})
</script>

<template>
  <Badge
    :variant="props.variant"
    :title="absoluteTitle"
    :class="cn(
      'gap-1 rounded-full font-medium tabular-nums',
      props.short && 'px-2',
      props.class,
    )"
  >
    <span
      v-if="iconClass"
      :class="cn('size-3.5 shrink-0', iconClass)"
      aria-hidden="true"
    />
    <time :datetime="datetime">
      <slot :time-ago="timeAgo">{{ timeAgo }}</slot>
    </time>
  </Badge>
</template>
