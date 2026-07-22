<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  total: number
  pageSize?: number
  siblingCount?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  siblingCount: 1,
})

const page = defineModel<number>({ default: 1 })

const DOTS = 'dots'

const pageCount = computed(() =>
  Math.max(1, Math.ceil(props.total / props.pageSize)),
)

// Render safely if the model drifts past the available pages: clamp for
// display/aria without mutating the caller's model.
const currentPage = computed(() =>
  Math.min(Math.max(page.value, 1), pageCount.value),
)

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) result.push(i)
  return result
}

// Standard shadcn/usePagination range with ellipsis markers.
const items = computed<(number | typeof DOTS)[]>(() => {
  const count = pageCount.value
  const siblings = props.siblingCount
  // first + last + current + 2 siblings + 2 dots
  const totalPageNumbers = siblings + 5

  if (totalPageNumbers >= count) return range(1, count)

  const leftSibling = Math.max(currentPage.value - siblings, 1)
  const rightSibling = Math.min(currentPage.value + siblings, count)

  const showLeftDots = leftSibling > 2
  const showRightDots = rightSibling < count - 2

  if (!showLeftDots && showRightDots) {
    const leftCount = 3 + 2 * siblings
    return [...range(1, leftCount), DOTS, count]
  }

  if (showLeftDots && !showRightDots) {
    const rightCount = 3 + 2 * siblings
    return [1, DOTS, ...range(count - rightCount + 1, count)]
  }

  return [1, DOTS, ...range(leftSibling, rightSibling), DOTS, count]
})

function goTo(target: number) {
  page.value = Math.min(Math.max(target, 1), pageCount.value)
}
</script>

<template>
  <nav
    role="navigation"
    aria-label="Pagination"
    :class="cn('flex items-center gap-1', props.class)"
  >
    <Button
      variant="ghost"
      size="icon"
      class="h-9 w-9"
      :disabled="currentPage <= 1"
      aria-label="Previous page"
      @click="goTo(currentPage - 1)"
    >
      <span class="i-lucide-chevron-left h-4 w-4" aria-hidden="true" />
    </Button>

    <template v-for="(item, index) in items">
      <span
        v-if="item === DOTS"
        :key="`dots-${index}`"
        class="flex h-9 w-9 items-center justify-center text-muted-foreground"
        aria-hidden="true"
      >
        &#8230;
      </span>
      <Button
        v-else
        :key="`page-${item}`"
        :variant="item === currentPage ? 'default' : 'ghost'"
        size="icon"
        class="h-9 w-9"
        :aria-label="`Go to page ${item}`"
        :aria-current="item === currentPage ? 'page' : undefined"
        @click="goTo(item as number)"
      >
        {{ item }}
      </Button>
    </template>

    <Button
      variant="ghost"
      size="icon"
      class="h-9 w-9"
      :disabled="currentPage >= pageCount"
      aria-label="Next page"
      @click="goTo(currentPage + 1)"
    >
      <span class="i-lucide-chevron-right h-4 w-4" aria-hidden="true" />
    </Button>
  </nav>
</template>
