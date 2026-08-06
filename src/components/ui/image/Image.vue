<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, inject, ref, watch } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  defaultImageProvider,
  IMAGE_PROVIDER_KEY,
  IMAGE_SRCSET_WIDTHS,
  type ImageFormat,
} from './provider'

export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  src?: string | null
  alt?: string
  /** Shown when the primary `src` fails to load (URL or left to #fallback slot). */
  fallback?: string
  /** Intrinsic width — used for aspect-ratio reservation and default provider width. */
  width?: number
  /** Intrinsic height — paired with `width` for CSS `aspect-ratio` (CLS). */
  height?: number
  /** Native `sizes` attribute for responsive selection. */
  sizes?: string
  quality?: number
  format?: ImageFormat
  /** Eager load + high fetch priority (above-the-fold). */
  priority?: boolean
  /** Low-quality / ThumbHash data URL shown under the skeleton while loading. */
  blurDataURL?: string
  objectFit?: ImageObjectFit
  class?: HTMLAttributes['class']
  imgClass?: HTMLAttributes['class']
}>(), {
  alt: '',
  quality: 75,
  format: 'webp',
  priority: false,
  objectFit: 'cover',
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const provider = inject(IMAGE_PROVIDER_KEY, defaultImageProvider)

type Status = 'empty' | 'loading' | 'loaded' | 'error'

const status = ref<Status>('empty')
/** Raw source currently driving the request (props.src or props.fallback). */
const sourceKey = ref<string | null>(null)
const usedFallback = ref(false)

const objectFitClass = computed(() => {
  switch (props.objectFit) {
    case 'contain':
      return 'object-contain'
    case 'fill':
      return 'object-fill'
    case 'none':
      return 'object-none'
    case 'scale-down':
      return 'object-scale-down'
    case 'cover':
    default:
      return 'object-cover'
  }
})

const providerWidth = computed(() => props.width ?? 1080)

function resolveUrl(src: string, width: number) {
  return provider({
    src,
    width,
    quality: props.quality,
    format: props.format,
  })
}

const resolvedSrc = computed(() => {
  if (!sourceKey.value)
    return null
  return resolveUrl(sourceKey.value, providerWidth.value)
})

const resolvedSrcset = computed(() => {
  if (!sourceKey.value)
    return undefined

  const entries = IMAGE_SRCSET_WIDTHS.map(width => ({
    url: resolveUrl(sourceKey.value!, width),
    width,
  }))

  // Passthrough providers yield identical URLs — omit useless srcset.
  if (entries.every(entry => entry.url === entries[0]?.url))
    return undefined

  return entries.map(entry => `${entry.url} ${entry.width}w`).join(', ')
})

const wrapperStyle = computed<CSSProperties>(() => {
  if (props.width && props.height)
    return { aspectRatio: `${props.width} / ${props.height}` }
  return {}
})

function resetFromSrc(src: string | null | undefined) {
  usedFallback.value = false

  if (!src) {
    status.value = 'empty'
    sourceKey.value = null
    return
  }

  status.value = 'loading'
  sourceKey.value = src
}

watch(() => props.src, src => resetFromSrc(src), { immediate: true })

watch(
  () => [props.quality, props.format, props.width] as const,
  () => {
    // Provider inputs changed — remount load cycle for the same logical src.
    if (sourceKey.value && status.value === 'loaded')
      status.value = 'loading'
  },
)

watch(() => props.fallback, () => {
  if (status.value === 'error' && props.fallback && !usedFallback.value) {
    usedFallback.value = true
    status.value = 'loading'
    sourceKey.value = props.fallback
  }
})

function onLoad(event: Event) {
  status.value = 'loaded'
  emit('load', event)
}

function onError(event: Event) {
  if (!usedFallback.value && props.fallback && sourceKey.value !== props.fallback) {
    usedFallback.value = true
    status.value = 'loading'
    sourceKey.value = props.fallback
    return
  }

  status.value = 'error'
  emit('error', event)
}

const showImage = computed(() =>
  !!resolvedSrc.value && (status.value === 'loading' || status.value === 'loaded'),
)

const showSkeleton = computed(() => status.value === 'loading')
const showEmpty = computed(() => status.value === 'empty')
const showError = computed(() => status.value === 'error')
const showBlur = computed(() => !!props.blurDataURL && status.value === 'loading')
</script>

<template>
  <div
    :class="cn(
      'relative overflow-hidden bg-muted',
      props.class,
    )"
    :style="wrapperStyle"
    data-slot="image"
    :data-status="status"
  >
    <img
      v-if="showBlur"
      :src="props.blurDataURL"
      alt=""
      aria-hidden="true"
      :class="cn(
        'absolute inset-0 size-full scale-105 blur-md',
        objectFitClass,
      )"
    >

    <img
      v-if="showImage"
      v-bind="$attrs"
      :src="resolvedSrc!"
      :srcset="resolvedSrcset"
      :sizes="props.sizes"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      :loading="props.priority ? 'eager' : 'lazy'"
      :fetchpriority="props.priority ? 'high' : 'auto'"
      decoding="async"
      :class="cn(
        'relative size-full',
        objectFitClass,
        status === 'loading' && 'opacity-0',
        status === 'loaded' && 'opacity-100',
        'transition-opacity duration-200',
        props.imgClass,
      )"
      @load="onLoad"
      @error="onError"
    >

    <Skeleton
      v-if="showSkeleton && !showBlur"
      class="absolute inset-0 size-full rounded-none"
    />

    <div
      v-else-if="showEmpty"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3 text-muted-foreground"
    >
      <slot name="empty">
        <span class="i-lucide-image h-6 w-6" aria-hidden="true" />
        <span class="text-xs">No image</span>
      </slot>
    </div>

    <div
      v-else-if="showError"
      class="absolute inset-0 flex flex-col items-center justify-center gap-1 p-3 text-muted-foreground"
    >
      <slot name="fallback" :src="props.src">
        <span class="i-lucide-image-off h-6 w-6" aria-hidden="true" />
        <span class="text-xs">Unavailable</span>
      </slot>
    </div>
  </div>
</template>
