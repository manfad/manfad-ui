<script setup lang="ts">
import { provide, shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createCdnImageProvider,
  Image,
  IMAGE_PROVIDER_KEY,
  type ImageProvider,
} from '@/components/ui/image'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.image
const broken = shallowRef(true)

const cdn = createCdnImageProvider('https://cdn.example.com')

// Demo provider: local paths stay loadable (query varies srcset); logical keys show CDN shape.
const demoProvider: ImageProvider = (opts) => {
  if (opts.src.startsWith('/')) {
    const params = new URLSearchParams({
      w: String(opts.width),
      q: String(opts.quality ?? 75),
    })
    return `${opts.src}?${params.toString()}`
  }
  return cdn(opts)
}

provide(IMAGE_PROVIDER_KEY, demoProvider)
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Default</CardTitle>
        <CardDescription>
          With a CDN provider injected, <code class="text-xs">src</code> becomes a width-tier URL (inspect the request).
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-2">
        <Image
          src="/demo-photo.jpg"
          alt="Mountain landscape"
          :width="320"
          :height="180"
          sizes="320px"
          class="w-80 rounded-md"
        />
        <p class="text-xs text-muted-foreground">
          CDN shape (for upload keys): <code>{{ cdn({ src: 'uploads/demo.webp', width: 1080 }) }}</code>
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>srcset + aspect-ratio</CardTitle>
        <CardDescription>
          Reserves layout space via <code class="text-xs">width</code>/<code class="text-xs">height</code> and emits srcset for 640/1080/1920.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src="/demo-photo.jpg"
          alt="Mountain landscape hero"
          :width="1600"
          :height="900"
          sizes="(max-width: 768px) 100vw, 768px"
          class="w-full max-w-xl rounded-md"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>empty</CardTitle>
        <CardDescription>
          No <code class="text-xs">src</code> — empty placeholder.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          class="size-40 rounded-md"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>fallback</CardTitle>
        <CardDescription>
          Broken primary URL falls back to another image (passthrough paths work too).
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-start gap-4">
        <Image
          src="/does-not-exist.png"
          fallback="/demo-photo.jpg"
          alt="Fallback demo"
          class="size-40 rounded-md"
        />
        <div class="flex flex-col gap-2">
          <Image
            :src="broken ? '/does-not-exist.png' : '/demo-photo.jpg'"
            alt="Error state"
            class="size-40 rounded-md"
          >
            <template #fallback>
              <span class="i-lucide-image-off h-6 w-6" aria-hidden="true" />
              <span class="text-xs">Custom fallback</span>
            </template>
          </Image>
          <Button size="sm" variant="outline" @click="broken = !broken">
            Toggle src
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>priority</CardTitle>
        <CardDescription>
          Above-the-fold: <code class="text-xs">loading="eager"</code> + high fetch priority.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Image
          src="/demo-photo.jpg"
          alt="Priority"
          priority
          class="size-24 rounded-md"
        />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
