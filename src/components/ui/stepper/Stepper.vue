<script lang="ts">
export interface StepperStep {
  title: string
  description?: string
  /** UnoCSS icon class shown in the circle instead of the step number (replaced by a check when completed). */
  icon?: string
}

export type StepperVariant = 'default' | 'dots' | 'counter'
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  steps: StepperStep[]
  orientation?: 'horizontal' | 'vertical'
  /**
   * `dots` — pill indicator for the current step.
   * `counter` — single circle whose number tracks the current step.
   */
  variant?: StepperVariant
  clickable?: boolean
  class?: HTMLAttributes['class']
}>(), {
  orientation: 'horizontal',
  variant: 'default',
  clickable: false,
})

const current = defineModel<number>({ default: 0 })

const counterLabel = computed(() => {
  const step = props.steps[current.value]
  const n = current.value + 1
  const total = props.steps.length
  return step ? `Step ${n} of ${total}: ${step.title}` : `Step ${n} of ${total}`
})


function isCompleted(index: number): boolean {
  return index < current.value
}

function isCurrent(index: number): boolean {
  return index === current.value
}

function isLast(index: number): boolean {
  return index === props.steps.length - 1
}

function circleClass(index: number): string {
  if (isCompleted(index) || isCurrent(index))
    return 'bg-primary text-primary-foreground font-semibold'
  return 'border-2 border-border bg-background text-muted-foreground'
}

function titleClass(index: number): string {
  if (isCurrent(index))
    return 'font-medium text-foreground'
  if (isCompleted(index))
    return 'text-foreground'
  return 'text-muted-foreground'
}

function connectorClass(index: number): string {
  return isCompleted(index) ? 'bg-primary' : 'bg-border'
}

function selectStep(index: number): void {
  if (props.clickable)
    current.value = index
}
</script>

<template>
  <nav
    aria-label="Progress"
    :class="cn(
      props.variant === 'dots' || props.variant === 'counter' ? 'w-auto' : 'w-full',
      props.class,
    )"
  >
    <!-- Counter: one circle; number updates with the current step (1-based). -->
    <div
      v-if="props.variant === 'counter'"
      class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground tabular-nums"
      :aria-label="counterLabel"
      aria-live="polite"
    >
      <span :key="current">{{ current + 1 }}</span>
    </div>

    <!-- Dots: compact page-style indicator — gray dots, primary pill for current. -->
    <ol
      v-else-if="props.variant === 'dots'"
      class="flex items-center gap-1.5"
    >
      <li v-for="(step, index) in props.steps" :key="index">
        <component
          :is="props.clickable ? 'button' : 'div'"
          :type="props.clickable ? 'button' : undefined"
          :aria-label="step.title"
          :aria-current="isCurrent(index) ? 'step' : undefined"
          class="block rounded-full transition-[width,background-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :class="[
            isCurrent(index)
              ? 'h-2 w-6 bg-primary'
              : 'h-2 w-2 bg-muted-foreground/30',
            props.clickable && 'cursor-pointer',
          ]"
          @click="selectStep(index)"
        />
      </li>
    </ol>

    <!-- Horizontal: circle row first so connectors butt against the circles,
         labels below, left-aligned under their circle. -->
    <ol v-else-if="props.orientation === 'horizontal'" class="flex">
      <li
        v-for="(step, index) in props.steps"
        :key="index"
        class="min-w-0"
        :class="isLast(index) ? 'flex-none' : 'flex-1'"
      >
        <div class="flex items-center">
          <component
            :is="props.clickable ? 'button' : 'div'"
            :type="props.clickable ? 'button' : undefined"
            :aria-current="isCurrent(index) ? 'step' : undefined"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="[circleClass(index), props.clickable && 'cursor-pointer']"
            @click="selectStep(index)"
          >
            <span v-if="isCompleted(index)" class="i-lucide-check h-4 w-4" aria-hidden="true" />
            <span v-else-if="step.icon" :class="step.icon" class="h-4 w-4" aria-hidden="true" />
            <template v-else>{{ index + 1 }}</template>
          </component>
          <div v-if="!isLast(index)" class="h-0.5 flex-1" :class="connectorClass(index)" />
        </div>
        <div
          class="mt-2 flex flex-col gap-0.5 pr-4"
          :class="props.clickable && 'cursor-pointer'"
          @click="selectStep(index)"
        >
          <span class="text-sm" :class="titleClass(index)">{{ step.title }}</span>
          <span v-if="step.description" class="text-xs text-muted-foreground">{{ step.description }}</span>
        </div>
      </li>
    </ol>

    <!-- Vertical: rail column stretches to the row's full height so the
         connector touches the next circle. -->
    <ol v-else class="flex flex-col">
      <li v-for="(step, index) in props.steps" :key="index" class="flex gap-3">
        <div class="flex flex-col items-center">
          <component
            :is="props.clickable ? 'button' : 'div'"
            :type="props.clickable ? 'button' : undefined"
            :aria-current="isCurrent(index) ? 'step' : undefined"
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            :class="[circleClass(index), props.clickable && 'cursor-pointer']"
            @click="selectStep(index)"
          >
            <span v-if="isCompleted(index)" class="i-lucide-check h-4 w-4" aria-hidden="true" />
            <span v-else-if="step.icon" :class="step.icon" class="h-4 w-4" aria-hidden="true" />
            <template v-else>{{ index + 1 }}</template>
          </component>
          <div v-if="!isLast(index)" class="min-h-6 w-0.5 flex-1" :class="connectorClass(index)" />
        </div>
        <div
          class="flex flex-col gap-0.5 pt-1.5"
          :class="[!isLast(index) && 'pb-6', props.clickable && 'cursor-pointer']"
          @click="selectStep(index)"
        >
          <span class="text-sm" :class="titleClass(index)">{{ step.title }}</span>
          <span v-if="step.description" class="text-xs text-muted-foreground">{{ step.description }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>
