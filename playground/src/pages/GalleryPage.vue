<script setup lang="ts">
import type { GalleryItem } from '@/components/ui/gallery'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gallery } from '@/components/ui/gallery'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.gallery

const items: GalleryItem[] = [
  {
    src: 'https://picsum.photos/id/1015/1200/800',
    alt: 'Mountain river landscape',
  },
  {
    src: 'https://picsum.photos/id/1016/800/600',
    alt: 'Mountain ridge',
  },
  {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    type: 'video',
    alt: 'A flower moving in the wind',
  },
  { src: 'https://picsum.photos/id/1025/800/600', alt: 'Dog portrait' },
  { src: 'https://picsum.photos/id/1035/800/600', alt: 'Waterfall landscape' },
  { src: 'https://picsum.photos/id/1043/800/600', alt: 'Rocky coastline' },
  { src: 'https://picsum.photos/id/1050/800/600', alt: 'Ocean view' },
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
        <CardDescription>
          Open mixed images and video in a black viewer with thumbnails, arrows,
          swipe navigation, and keyboard controls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Gallery
          :items="items"
          title="Product media"
          :preview-height="480"
          black
        />
        <p class="mt-3 text-sm text-muted-foreground">
          The thumbnail stack adapts to the preview size. Use ←/→ to navigate.
          Press Space to play or pause video.
        </p>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
