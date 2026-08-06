<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from 'vue'
import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Empty } from '@/components/ui/empty'
import { Image } from '@/components/ui/image'
import { cn } from '@/lib/utils'
import emptyImage from './empty-image.svg'

export type GalleryMediaType = 'auto' | 'image' | 'video'
export type GalleryPreviewPosition = 'left' | 'right'

export interface GalleryItem {
  src: string
  type?: GalleryMediaType
  alt?: string
  poster?: string
}

export interface GalleryProps {
  /** Single-item shorthand. Prefer `items` for a gallery. */
  src?: string
  type?: GalleryMediaType
  alt?: string
  poster?: string
  items?: GalleryItem[]
  title?: string
  /** Use a black dialog surface around the media. */
  black?: boolean
  thumbnails?: boolean
  /** Side used by the stacked closed-state preview thumbnails. */
  previewPosition?: GalleryPreviewPosition
  /** Fixed preview height. Numbers are interpreted as pixels. */
  previewHeight?: number | string
  /** Preview aspect ratio used when `previewHeight` is not set. */
  previewAspectRatio?: number | string
  /** Maximum number of thumbnails in the adaptive preview stack. */
  maxPreviewItems?: number
  class?: HTMLAttributes['class']
  mediaClass?: HTMLAttributes['class']
  thumbnailClass?: HTMLAttributes['class']
  dialogClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<GalleryProps>(), {
  type: 'auto',
  alt: '',
  title: 'Media preview',
  black: false,
  thumbnails: true,
  previewPosition: 'right',
  previewAspectRatio: '16 / 10',
  maxPreviewItems: 6,
})

const open = defineModel<boolean>('open', { default: false })
const activeIndex = defineModel<number>('index', { default: 0 })
const videoRef = useTemplateRef<HTMLVideoElement>('video')
const previewRef = useTemplateRef<HTMLElement>('preview')

let pointerId: number | null = null
let pointerStartX = 0
let pointerStartTime = 0
let previewResizeObserver: ResizeObserver | undefined
const visiblePreviewCapacity = shallowRef(3)

const mediaItems = computed<GalleryItem[]>(() => {
  if (props.items?.length)
    return props.items
  if (!props.src)
    return []
  return [{ src: props.src, type: props.type, alt: props.alt, poster: props.poster }]
})

const itemCount = computed(() => mediaItems.value.length)
const hasNavigation = computed(() => itemCount.value > 1)
const activeItem = computed(() => mediaItems.value[activeIndex.value] ?? mediaItems.value[0])
const previewItems = computed(() => mediaItems.value.slice(1, 1 + visiblePreviewCapacity.value))
const remainingCount = computed(() => Math.max(itemCount.value - 1 - previewItems.value.length, 0))
const previewStyle = computed<CSSProperties>(() => {
  const height = typeof props.previewHeight === 'number'
    ? `${props.previewHeight}px`
    : props.previewHeight

  return {
    height,
    aspectRatio: height ? undefined : String(props.previewAspectRatio),
  }
})

function mediaType(item?: GalleryItem): Exclude<GalleryMediaType, 'auto'> {
  if (item?.type && item.type !== 'auto')
    return item.type
  return item && /\.(?:mp4|webm|ogv|ogg|mov|m4v)(?:$|[?#])/i.test(item.src)
    ? 'video'
    : 'image'
}

const activeType = computed(() => mediaType(activeItem.value))
const triggerItem = computed(() => mediaItems.value[0])

function updatePreviewCapacity() {
  const preview = previewRef.value
  if (!preview)
    return

  const { width, height } = preview.getBoundingClientRect()
  const gap = width >= 640 ? 12 : 8
  const railWidth = Math.max((width - gap) * 0.25, 1)
  const preferredTileHeight = Math.max(48, railWidth * 0.75)
  const fittingItems = Math.max(1, Math.floor((height + gap) / (preferredTileHeight + gap)))
  const maximum = Math.max(1, Math.floor(props.maxPreviewItems))
  visiblePreviewCapacity.value = Math.min(fittingItems, maximum)
}

function observePreview(element?: HTMLElement | null) {
  previewResizeObserver?.disconnect()
  if (!element || typeof ResizeObserver === 'undefined')
    return
  previewResizeObserver = new ResizeObserver(updatePreviewCapacity)
  previewResizeObserver.observe(element)
  updatePreviewCapacity()
}

function openAt(index: number) {
  activeIndex.value = index
  open.value = true
}

function pauseVideo() {
  videoRef.value?.pause()
}

async function setIndex(index: number) {
  if (itemCount.value === 0)
    return
  pauseVideo()
  activeIndex.value = (index + itemCount.value) % itemCount.value
  await nextTick()
  videoRef.value?.focus({ preventScroll: true })
}

function previous() {
  void setIndex(activeIndex.value - 1)
}

function next() {
  void setIndex(activeIndex.value + 1)
}

async function togglePlayback() {
  const video = videoRef.value
  if (!video)
    return
  if (video.paused)
    await video.play()
  else
    video.pause()
}

function onKeydown(event: KeyboardEvent) {
  if (!open.value)
    return
  const target = event.target
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)
    return

  if (event.key === 'ArrowLeft' && hasNavigation.value) {
    event.preventDefault()
    previous()
  }
  else if (event.key === 'ArrowRight' && hasNavigation.value) {
    event.preventDefault()
    next()
  }
  else if (event.code === 'Space' && activeType.value === 'video') {
    event.preventDefault()
    void togglePlayback()
  }
}

function onPointerDown(event: PointerEvent) {
  if (!event.isPrimary || !hasNavigation.value || pointerId !== null)
    return
  pointerId = event.pointerId
  pointerStartX = event.clientX
  pointerStartTime = performance.now()
  event.currentTarget instanceof HTMLElement && event.currentTarget.setPointerCapture(event.pointerId)
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerId !== pointerId)
    return
  const distance = event.clientX - pointerStartX
  const elapsed = Math.max(performance.now() - pointerStartTime, 1)
  const velocity = Math.abs(distance) / elapsed
  pointerId = null

  if (Math.abs(distance) < 48 && velocity < 0.35)
    return
  if (distance > 0)
    previous()
  else
    next()
}

watch(open, (isOpen) => {
  if (!isOpen)
    pauseVideo()
  else if (activeIndex.value < 0 || activeIndex.value >= itemCount.value)
    activeIndex.value = 0
})

watch(itemCount, (count) => {
  if (count === 0 || activeIndex.value < 0 || activeIndex.value >= count)
    activeIndex.value = 0
})

watch(previewRef, element => observePreview(element), { flush: 'post' })
watch(() => props.maxPreviewItems, updatePreviewCapacity)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  observePreview(previewRef.value)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  previewResizeObserver?.disconnect()
})
</script>

<template>
  <div
    v-if="triggerItem"
    ref="preview"
    :class="cn('flex w-full gap-2 sm:gap-3', props.class)"
    :style="previewStyle"
  >
    <button
      type="button"
      :aria-label="`Open ${props.title}, item 1 of ${itemCount}`"
      :class="cn(
        'group relative min-w-0 overflow-hidden rounded-xl bg-muted text-left outline-none transition-transform duration-150 active:scale-[0.995] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        itemCount > 1 ? 'w-3/4' : 'w-full',
        props.previewPosition === 'left' && 'order-2',
      )"
      @click="openAt(0)"
    >
      <Image
        v-if="mediaType(triggerItem) === 'image'"
        :src="triggerItem.src"
        :alt="triggerItem.alt ?? props.alt"
        object-fit="cover"
        class="absolute inset-0 size-full bg-muted"
        :img-class="cn('pointer-events-none', props.mediaClass)"
      >
        <template #empty>
          <img
            :src="emptyImage"
            alt=""
            class="h-full w-full object-contain p-[12%]"
            aria-hidden="true"
          >
        </template>
        <template #fallback>
          <img
            :src="emptyImage"
            alt=""
            class="h-full w-full object-contain p-[12%]"
            aria-hidden="true"
          >
        </template>
      </Image>
      <video
        v-else
        :src="triggerItem.src"
        :poster="triggerItem.poster"
        muted
        playsinline
        preload="metadata"
        :class="cn('h-full w-full object-cover', props.mediaClass)"
      />
      <span class="absolute inset-0 z-20 bg-black/0 transition-colors duration-150 group-hover:bg-black/10" />
      <span
        v-if="mediaType(triggerItem) === 'video'"
        class="absolute left-1/2 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white shadow-sm backdrop-blur-sm"
      >
        <span class="i-lucide-play h-5 w-5" aria-hidden="true" />
      </span>
    </button>

    <div
      v-if="previewItems.length"
      class="grid w-1/4 min-w-0 gap-2 sm:gap-3"
      :class="props.previewPosition === 'left' && 'order-1'"
      :style="{ gridTemplateRows: `repeat(${previewItems.length}, minmax(0, 1fr))` }"
    >
      <button
        v-for="(item, previewIndex) in previewItems"
        :key="`${item.src}-${previewIndex + 1}`"
        type="button"
        :aria-label="`Open ${props.title}, item ${previewIndex + 2} of ${itemCount}`"
        class="group relative min-h-0 overflow-hidden rounded-xl bg-muted text-left outline-none transition-transform duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        @click="openAt(previewIndex + 1)"
      >
        <Image
          v-if="mediaType(item) === 'image'"
          :src="item.src"
          :alt="item.alt ?? ''"
          object-fit="cover"
          class="absolute inset-0 size-full bg-muted"
          :img-class="cn('pointer-events-none', props.mediaClass)"
        >
          <template #empty>
            <img
              :src="emptyImage"
              alt=""
              class="h-full w-full object-contain p-3"
              aria-hidden="true"
            >
          </template>
          <template #fallback>
            <img
              :src="emptyImage"
              alt=""
              class="h-full w-full object-contain p-3"
              aria-hidden="true"
            >
          </template>
        </Image>
        <video
          v-else
          :src="item.src"
          :poster="item.poster"
          class="h-full w-full object-cover"
          muted
          playsinline
          preload="metadata"
        />
        <span class="absolute inset-0 z-20 bg-black/0 transition-colors duration-150 group-hover:bg-black/10" />
        <span
          v-if="remainingCount > 0 && previewIndex === previewItems.length - 1"
          class="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/55 text-center text-white backdrop-blur-[1px]"
        >
          <span class="i-lucide-plus mb-1 h-5 w-5" aria-hidden="true" />
          <span class="text-xs font-semibold sm:text-sm">{{ remainingCount }} more</span>
        </span>
        <span
          v-else-if="mediaType(item) === 'video'"
          class="absolute inset-0 z-20 flex items-center justify-center text-white"
        >
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-black/65 shadow-sm backdrop-blur-sm">
            <span class="i-lucide-play h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </button>
    </div>
  </div>

  <Empty
    v-else
    :image="emptyImage"
    title="No media"
    description="Add an image or video to display it here."
    :class="cn('w-full rounded-xl', props.class)"
    :style="previewStyle"
  />

  <Dialog v-model:open="open">
    <DialogContent
      size="xxxl"
      :overlay-class="props.black ? '!bg-black' : undefined"
      :class="cn(
        'overflow-hidden p-0',
        props.black && 'border-black bg-black text-white [&>button]:text-white [&>button]:ring-offset-black',
        props.dialogClass,
      )"
    >
      <DialogTitle class="sr-only">{{ props.title }}</DialogTitle>
      <div
        class="relative flex min-h-64 touch-pan-y select-none items-center justify-center sm:min-h-[32rem]"
        :class="props.black ? 'bg-black' : 'bg-muted/40'"
        @pointerdown="onPointerDown"
        @pointerup="onPointerUp"
        @pointercancel="pointerId = null"
      >
        <Image
          v-if="activeItem && activeType === 'image'"
          :src="activeItem.src"
          :alt="activeItem.alt ?? props.alt"
          object-fit="contain"
          class="relative z-10 max-h-[82vh] w-full max-w-full bg-transparent"
          :img-class="cn('max-h-[82vh] w-auto', props.mediaClass)"
          draggable="false"
        >
          <template #empty>
            <img
              :src="emptyImage"
              alt=""
              class="max-h-48 w-auto object-contain"
              aria-hidden="true"
            >
          </template>
          <template #fallback>
            <img
              :src="emptyImage"
              alt=""
              class="max-h-48 w-auto object-contain"
              aria-hidden="true"
            >
          </template>
        </Image>
        <video
          v-else-if="activeItem"
          ref="video"
          :src="activeItem.src"
          :poster="activeItem.poster"
          :class="cn('max-h-[82vh] max-w-full outline-none', props.mediaClass)"
          controls
          playsinline
          preload="metadata"
        />

        <template v-if="hasNavigation">
          <button
            type="button"
            class="absolute left-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white shadow-sm backdrop-blur-sm transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Previous media"
            @click.stop="previous"
          >
            <span class="i-lucide-chevron-left h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            class="absolute right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white shadow-sm backdrop-blur-sm transition-transform duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Next media"
            @click.stop="next"
          >
            <span class="i-lucide-chevron-right h-5 w-5" aria-hidden="true" />
          </button>
          <span class="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {{ activeIndex + 1 }} / {{ itemCount }}
          </span>
        </template>
      </div>

      <div
        v-if="props.thumbnails && hasNavigation"
        class="flex gap-2 overflow-x-auto border-t p-3"
        :class="props.black ? 'border-white/15 bg-black' : 'border-border bg-background'"
        aria-label="Gallery thumbnails"
      >
        <button
          v-for="(item, index) in mediaItems"
          :key="`${item.src}-${index}`"
          type="button"
          :aria-label="`Show media ${index + 1}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          :class="cn(
            'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 bg-muted outline-none transition-[border-color,opacity,transform] duration-150 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            index === activeIndex ? 'border-primary opacity-100' : 'border-transparent opacity-65 hover:opacity-100',
            props.thumbnailClass,
          )"
          @click="setIndex(index)"
        >
          <Image
            v-if="mediaType(item) === 'image'"
            :src="item.src"
            :alt="item.alt ?? ''"
            object-fit="cover"
            class="absolute inset-0 size-full"
          >
            <template #empty>
              <img
                :src="emptyImage"
                alt=""
                class="h-full w-full object-contain p-2"
                aria-hidden="true"
              >
            </template>
            <template #fallback>
              <img
                :src="emptyImage"
                alt=""
                class="h-full w-full object-contain p-2"
                aria-hidden="true"
              >
            </template>
          </Image>
          <video
            v-else
            :src="item.src"
            :poster="item.poster"
            class="h-full w-full object-cover"
            muted
            playsinline
            preload="metadata"
          />
          <span
            v-if="mediaType(item) === 'video'"
            class="absolute inset-0 z-20 flex items-center justify-center bg-black/20 text-white"
          >
            <span class="i-lucide-play h-4 w-4" aria-hidden="true" />
          </span>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
