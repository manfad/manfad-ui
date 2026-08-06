<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import MarkdownIt from 'markdown-it'
import { computed, shallowRef, watch } from 'vue'
import { cn } from '@/lib/utils'

export interface MdViewProps {
  /** Runtime URL for a Markdown file, similar to an image src. */
  src?: string
  /** Markdown supplied directly, including content imported with `?raw`. */
  content?: string
  class?: HTMLAttributes['class']
  loadingLabel?: string
  emptyLabel?: string
}

const props = withDefaults(defineProps<MdViewProps>(), {
  loadingLabel: 'Loading document…',
  emptyLabel: 'No Markdown to display.',
})

const emit = defineEmits<{
  load: [content: string]
  error: [error: Error]
}>()

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

const source = shallowRef('')
const loading = shallowRef(false)
const errorMessage = shallowRef('')

const rendered = computed(() => markdown.render(source.value))

watch(
  () => [props.src, props.content] as const,
  async ([src, content], _previous, onCleanup) => {
    errorMessage.value = ''

    if (content !== undefined) {
      source.value = content
      loading.value = false
      emit('load', content)
      return
    }

    if (!src) {
      source.value = ''
      loading.value = false
      return
    }

    if (typeof window === 'undefined') {
      // Match the client's first render so hydration stays stable.
      loading.value = true
      return
    }

    const controller = new AbortController()
    onCleanup(() => controller.abort())
    loading.value = true

    try {
      const response = await fetch(src, {
        signal: controller.signal,
        headers: {
          Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.1',
        },
      })
      if (!response.ok)
        throw new Error(`Unable to load Markdown (${response.status})`)

      const nextSource = await response.text()
      source.value = nextSource
      emit('load', nextSource)
    }
    catch (error) {
      if (controller.signal.aborted)
        return
      const nextError = error instanceof Error ? error : new Error('Unable to load Markdown')
      source.value = ''
      errorMessage.value = nextError.message
      emit('error', nextError)
    }
    finally {
      if (!controller.signal.aborted)
        loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :class="cn('md-view', props.class)">
    <p v-if="loading" class="md-view-status" role="status">
      {{ props.loadingLabel }}
    </p>
    <p v-else-if="errorMessage" class="md-view-error" role="alert">
      {{ errorMessage }}
    </p>
    <!-- Raw HTML is disabled in markdown-it; v-html only receives parser output. -->
    <div v-else-if="source" class="md-view-content" v-html="rendered" />
    <p v-else class="md-view-status">
      {{ props.emptyLabel }}
    </p>
  </div>
</template>

<style scoped>
.md-view {
  color: hsl(var(--foreground));
  line-height: 1.7;
}

.md-view-status,
.md-view-error {
  margin: 0;
  border: 1px solid hsl(var(--border));
  border-radius: calc(var(--radius) - 2px);
  padding: 1rem;
  color: hsl(var(--muted-foreground));
  background: hsl(var(--muted) / 0.35);
}

.md-view-error {
  color: hsl(var(--destructive));
}

.md-view-content :deep(> :first-child) {
  margin-top: 0;
}

.md-view-content :deep(> :last-child) {
  margin-bottom: 0;
}

.md-view-content :deep(h1),
.md-view-content :deep(h2),
.md-view-content :deep(h3),
.md-view-content :deep(h4) {
  margin: 1.75em 0 0.65em;
  scroll-margin-top: 5rem;
  font-weight: 650;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

.md-view-content :deep(h1) { font-size: 2rem; }
.md-view-content :deep(h2) { font-size: 1.5rem; }
.md-view-content :deep(h3) { font-size: 1.2rem; }
.md-view-content :deep(h4) { font-size: 1rem; }

.md-view-content :deep(p),
.md-view-content :deep(ul),
.md-view-content :deep(ol),
.md-view-content :deep(pre),
.md-view-content :deep(blockquote),
.md-view-content :deep(table) {
  margin: 0.9rem 0;
}

.md-view-content :deep(ul),
.md-view-content :deep(ol) {
  padding-left: 1.5rem;
}

.md-view-content :deep(ul) { list-style: disc; }
.md-view-content :deep(ol) { list-style: decimal; }

.md-view-content :deep(a) {
  color: hsl(var(--primary));
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

.md-view-content :deep(blockquote) {
  border-left: 3px solid hsl(var(--border));
  padding-left: 1rem;
  color: hsl(var(--muted-foreground));
}

.md-view-content :deep(code) {
  border-radius: 0.3rem;
  padding: 0.15em 0.35em;
  background: hsl(var(--muted));
  font-size: 0.875em;
}

.md-view-content :deep(pre) {
  overflow-x: auto;
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius);
  padding: 1rem;
  background: hsl(var(--muted) / 0.5);
}

.md-view-content :deep(pre code) {
  padding: 0;
  background: transparent;
}

.md-view-content :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid hsl(var(--border));
}

.md-view-content :deep(img) {
  max-width: 100%;
  border-radius: var(--radius);
}

.md-view-content :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-collapse: collapse;
}

.md-view-content :deep(th),
.md-view-content :deep(td) {
  border: 1px solid hsl(var(--border));
  padding: 0.55rem 0.75rem;
  text-align: left;
}
</style>
