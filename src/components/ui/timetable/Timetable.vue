<script lang="ts">
import type { HTMLAttributes } from 'vue'

export interface TimetableDay {
  id: string
  label: string
}

export interface TimetableEvent {
  id: string | number
  day: string
  start: string
  end: string
  title: string
  subtitle?: string
  class?: HTMLAttributes['class']
}

export type TimetableOrientation = 'vertical' | 'horizontal'
</script>

<script setup lang="ts">
import { computed } from 'vue'
import TimetableEventCard from './TimetableEventCard.vue'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    days: TimetableDay[]
    events: TimetableEvent[]
    orientation?: TimetableOrientation
    startTime?: string
    endTime?: string
    stepMinutes?: number
    slotSize?: number
    dayWidth?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    orientation: 'vertical',
    startTime: '08:00',
    endTime: '17:30',
    stepMinutes: 30,
    slotSize: 40,
    dayWidth: 190,
  },
)

defineSlots<{
  event?(props: { event: TimetableEvent; timeLabel: string }): unknown
}>()

interface PositionedEvent {
  event: TimetableEvent
  dayIndex: number
  start: number
  end: number
  timeLabel: string
}

function timeToMinutes(value: string): number {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match)
    return Number.NaN

  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59)
    return Number.NaN

  return hours * 60 + minutes
}

function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`
}

const range = computed(() => {
  const start = timeToMinutes(props.startTime)
  const end = timeToMinutes(props.endTime)
  const step = Math.max(1, props.stepMinutes)
  const valid = Number.isFinite(start) && Number.isFinite(end) && end > start

  return {
    start: valid ? start : 8 * 60,
    end: valid ? end : 17 * 60 + 30,
    step,
  }
})

const ticks = computed(() => {
  const values: number[] = []
  for (let value = range.value.start; value < range.value.end; value += range.value.step)
    values.push(value)
  return values
})

const duration = computed(() => range.value.end - range.value.start)
const verticalSlotSize = computed(() => Math.max(24, props.slotSize))
const horizontalSlotSize = computed(() => Math.max(80, props.slotSize))
const verticalHeight = computed(() => (duration.value / range.value.step) * verticalSlotSize.value)
const horizontalWidth = computed(() => (duration.value / range.value.step) * horizontalSlotSize.value)

const positionedEvents = computed<PositionedEvent[]>(() => {
  const dayIndexes = new Map(props.days.map((day, index) => [day.id, index]))

  return props.events.flatMap((event) => {
    const dayIndex = dayIndexes.get(event.day)
    const rawStart = timeToMinutes(event.start)
    const rawEnd = timeToMinutes(event.end)

    if (dayIndex == null || !Number.isFinite(rawStart) || !Number.isFinite(rawEnd) || rawEnd <= rawStart)
      return []

    const start = Math.max(rawStart, range.value.start)
    const end = Math.min(rawEnd, range.value.end)
    if (end <= start)
      return []

    return [{
      event,
      dayIndex,
      start,
      end,
      timeLabel: `${formatTime(rawStart)} – ${formatTime(rawEnd)}`,
    }]
  })
})

const rootStyle = computed(() => ({
  '--tt-day-width': `${Math.max(120, props.dayWidth)}px`,
  '--tt-slot-size': `${props.orientation === 'vertical' ? verticalSlotSize.value : horizontalSlotSize.value}px`,
  '--tt-day-count': String(Math.max(1, props.days.length)),
}))

function verticalEventStyle(item: PositionedEvent): Record<string, string> {
  return {
    left: `calc(${item.dayIndex} * 100% / ${Math.max(1, props.days.length)})`,
    top: `${((item.start - range.value.start) / range.value.step) * verticalSlotSize.value}px`,
    width: `calc(100% / ${Math.max(1, props.days.length)})`,
    height: `${((item.end - item.start) / range.value.step) * verticalSlotSize.value}px`,
  }
}

function horizontalEventStyle(item: PositionedEvent): Record<string, string> {
  return {
    left: `${((item.start - range.value.start) / range.value.step) * horizontalSlotSize.value}px`,
    top: `${item.dayIndex * 72}px`,
    width: `${((item.end - item.start) / range.value.step) * horizontalSlotSize.value}px`,
    height: '72px',
  }
}
</script>

<template>
  <div
    v-bind="$attrs"
    :class="cn('timetable overflow-auto rounded-lg border bg-background text-foreground', props.class)"
    :style="rootStyle"
  >
    <div
      v-if="orientation === 'vertical'"
      class="timetable-vertical"
      :style="{ minWidth: `calc(4rem + ${days.length} * var(--tt-day-width))` }"
    >
      <div class="vertical-header sticky top-0 z-20 grid bg-background">
        <div class="sticky left-0 z-30 border-b border-r bg-background" aria-hidden="true" />
        <div
          v-for="day in days"
          :key="day.id"
          class="flex h-10 items-center justify-center border-b border-r px-3 text-sm font-semibold last:border-r-0"
        >
          {{ day.label }}
        </div>
      </div>

      <div class="relative" :style="{ height: `${verticalHeight}px` }">
        <div class="sticky left-0 z-10 h-full w-16 bg-background">
          <div
            v-for="(tick, index) in ticks"
            :key="tick"
            class="absolute right-1 -translate-y-1/2 whitespace-nowrap bg-transparent text-[10px] font-medium leading-none text-muted-foreground"
            :style="{ top: `${index * verticalSlotSize}px` }"
          >
            {{ formatTime(tick) }}
          </div>
        </div>

        <div class="absolute inset-y-0 left-16 right-0 flex">
          <div
            v-for="day in days"
            :key="day.id"
            class="h-full flex-1 border-r last:border-r-0 timetable-lines"
          />
        </div>

        <div class="absolute inset-y-0 left-16 right-0">
          <div
            v-for="item in positionedEvents"
            :key="item.event.id"
            class="absolute"
            :style="verticalEventStyle(item)"
          >
            <TimetableEventCard :event="item.event" :time-label="item.timeLabel">
              <template v-if="$slots.event" #default>
                <slot name="event" :event="item.event" :time-label="item.timeLabel" />
              </template>
            </TimetableEventCard>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="timetable-horizontal"
      :style="{ width: `calc(6rem + ${horizontalWidth}px)` }"
    >
      <div class="horizontal-header sticky top-0 z-20 flex h-10 bg-background">
        <div class="sticky left-0 z-30 w-24 shrink-0 border-b border-r bg-background" aria-hidden="true" />
        <div class="relative border-b" :style="{ width: `${horizontalWidth}px` }">
          <div
            v-for="(tick, index) in ticks"
            :key="tick"
            class="absolute top-0 flex h-10 items-center border-r px-2 text-xs font-medium text-muted-foreground"
            :style="{ left: `${index * horizontalSlotSize}px`, width: `${horizontalSlotSize}px` }"
          >
            {{ formatTime(tick) }}
          </div>
        </div>
      </div>

      <div class="relative" :style="{ height: `${days.length * 72}px` }">
        <div class="sticky left-0 z-10 h-full w-24 bg-background">
          <div
            v-for="(day, index) in days"
            :key="day.id"
            class="absolute left-0 flex w-full items-center border-b border-r px-3 text-sm font-semibold"
            :style="{ top: `${index * 72}px`, height: '72px' }"
          >
            {{ day.label }}
          </div>
        </div>

        <div class="absolute inset-y-0 left-24 timetable-horizontal-lines" :style="{ width: `${horizontalWidth}px` }">
          <div
            v-for="(day, index) in days"
            :key="day.id"
            class="absolute left-0 w-full border-b"
            :style="{ top: `${index * 72}px`, height: '72px' }"
          />
        </div>

        <div class="absolute inset-y-0 left-24" :style="{ width: `${horizontalWidth}px` }">
          <div
            v-for="item in positionedEvents"
            :key="item.event.id"
            class="absolute"
            :style="horizontalEventStyle(item)"
          >
            <TimetableEventCard :event="item.event" :time-label="item.timeLabel">
              <template v-if="$slots.event" #default>
                <slot name="event" :event="item.event" :time-label="item.timeLabel" />
              </template>
            </TimetableEventCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vertical-header {
  grid-template-columns: 4rem repeat(var(--tt-day-count), minmax(var(--tt-day-width), 1fr));
}

.timetable-lines {
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0,
    transparent calc(var(--tt-slot-size) - 1px),
    hsl(var(--border)) calc(var(--tt-slot-size) - 1px),
    hsl(var(--border)) var(--tt-slot-size)
  );
}

.timetable-horizontal-lines {
  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc(var(--tt-slot-size) - 1px),
    hsl(var(--border)) calc(var(--tt-slot-size) - 1px),
    hsl(var(--border)) var(--tt-slot-size)
  );
}
</style>
