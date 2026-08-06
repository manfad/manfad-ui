<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type ErrorPageTone = 'default' | 'warning' | 'danger'
export type ErrorPageVariant = 'error' | 'not-found' | 'unauthorized' | 'no-permission' | 'custom'

export interface ErrorPageProps {
  variant?: ErrorPageVariant
  code?: string
  icon?: string
  title?: string
  description?: string
  tone?: ErrorPageTone
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<ErrorPageProps>(), {
  variant: 'error',
})

const emit = defineEmits<{
  retry: []
  home: []
  signIn: []
  back: []
  requestAccess: []
}>()

defineSlots<{
  actions?(): unknown
}>()

interface VariantPreset {
  code?: string
  icon: string
  tone: ErrorPageTone
  title: string
  description: string
}

const variantPresets: Record<Exclude<ErrorPageVariant, 'custom'>, VariantPreset> = {
  error: {
    code: '500',
    icon: 'i-lucide-triangle-alert',
    tone: 'danger',
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Try again, or return home if the problem continues.',
  },
  'not-found': {
    code: '404',
    icon: 'i-lucide-file-question',
    tone: 'default',
    title: 'Page not found',
    description: 'The page you’re looking for doesn’t exist or may have been moved.',
  },
  unauthorized: {
    code: '401',
    icon: 'i-lucide-log-in',
    tone: 'default',
    title: 'Sign in required',
    description: 'Your session may have expired. Sign in to continue to this page.',
  },
  'no-permission': {
    code: '403',
    icon: 'i-lucide-shield-x',
    tone: 'warning',
    title: 'You don’t have permission',
    description: 'Your account does not have access to this area. Ask an administrator if you think this is a mistake.',
  },
}

// Every preset value is just a fallback — any prop overrides it, and switching
// `variant` at runtime re-resolves everything reactively.
const preset = computed(() =>
  props.variant === 'custom' ? undefined : variantPresets[props.variant],
)
const code = computed(() => props.code ?? preset.value?.code)
const icon = computed(() => props.icon ?? preset.value?.icon ?? 'i-lucide-circle-alert')
const tone = computed(() => props.tone ?? preset.value?.tone ?? 'default')
const title = computed(() => props.title ?? preset.value?.title)
const description = computed(() => props.description ?? preset.value?.description)

interface ToneStyle {
  badge: string
  glow: string
  watermark: string
}

const toneStyle = computed<ToneStyle>(() => ({
  default: {
    badge: 'bg-primary/10 text-primary ring-primary/20',
    glow: 'bg-primary/10',
    watermark: 'text-primary/[0.07]',
  },
  warning: {
    badge: 'bg-warning/15 text-warning-foreground ring-warning/25',
    glow: 'bg-warning/10',
    watermark: 'text-warning/[0.08]',
  },
  danger: {
    badge: 'bg-destructive/10 text-destructive ring-destructive/20',
    glow: 'bg-destructive/10',
    watermark: 'text-destructive/[0.07]',
  },
})[tone.value])
</script>

<template>
  <section
    :class="cn('relative flex min-h-[32rem] w-full items-center justify-center overflow-hidden rounded-xl border bg-background px-6 py-16 text-center', props.class)"
  >
    <!-- Tone-tinted glow anchoring the composition -->
    <div
      :class="cn('pointer-events-none absolute left-1/2 top-1/2 size-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl', toneStyle.glow)"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/50 via-background to-background" aria-hidden="true" />

    <!-- Ghost watermark of the status code -->
    <p
      v-if="code"
      :class="cn('pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-[9rem] font-black leading-none tracking-tighter sm:text-[12rem]', toneStyle.watermark)"
      aria-hidden="true"
    >
      {{ code }}
    </p>

    <div class="relative z-10 flex max-w-lg flex-col items-center">
      <div
        :class="cn('flex size-16 items-center justify-center rounded-2xl bg-card shadow-sm ring-1 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-500', toneStyle.badge)"
      >
        <span :class="cn('size-8', icon)" aria-hidden="true" />
      </div>
      <p
        v-if="code"
        class="mt-6 text-sm font-semibold tracking-[0.18em] text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-100"
      >
        {{ code }}
      </p>
      <h2
        v-if="title"
        class="mt-3 text-balance text-2xl font-bold tracking-tight motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-150 sm:text-3xl"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-3 max-w-md text-pretty text-sm leading-6 text-muted-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-200 sm:text-base"
      >
        {{ description }}
      </p>
      <div
        v-if="$slots.actions || props.variant !== 'custom'"
        class="mt-8 flex flex-wrap items-center justify-center gap-3 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500 motion-safe:delay-300"
      >
        <slot name="actions">
          <template v-if="props.variant === 'error'">
            <Button @click="emit('retry')">
              <span class="i-lucide-refresh-cw mr-2 size-4" aria-hidden="true" />
              Try again
            </Button>
            <Button variant="outline" @click="emit('home')">
              Go home
            </Button>
          </template>
          <template v-else-if="props.variant === 'not-found'">
            <Button @click="emit('home')">
              <span class="i-lucide-house mr-2 size-4" aria-hidden="true" />
              Go home
            </Button>
            <Button variant="outline" @click="emit('back')">
              Go back
            </Button>
          </template>
          <template v-else-if="props.variant === 'unauthorized'">
            <Button @click="emit('signIn')">
              Sign in
            </Button>
            <Button variant="outline" @click="emit('back')">
              Go back
            </Button>
          </template>
          <template v-else-if="props.variant === 'no-permission'">
            <Button @click="emit('back')">
              Go back
            </Button>
            <Button variant="outline" @click="emit('requestAccess')">
              Request access
            </Button>
          </template>
        </slot>
      </div>
    </div>
  </section>
</template>
