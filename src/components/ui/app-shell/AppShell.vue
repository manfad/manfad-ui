<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from 'radix-vue'
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { Sidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  sidebarClass?: HTMLAttributes['class']
  headerClass?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
  mobileSidebarLabel?: string
  openNavigationLabel?: string
  closeNavigationLabel?: string
}>(), {
  mobileSidebarLabel: 'Application navigation',
  openNavigationLabel: 'Open navigation',
  closeNavigationLabel: 'Close navigation',
})

// Mirrors Tailwind's `md` breakpoint (>= 768px): below it we swap the
// persistent desktop Sidebar for the Dialog-based mobile drawer. `isMobile` is
// the single source of truth for that switch (no CSS `hidden md:*` gating).
const MOBILE_MEDIA_QUERY = '(max-width: 767px)'

const mobileOpen = defineModel<boolean>('mobileOpen', { default: false })
const isMobile = shallowRef(false)
let mobileMediaQuery: MediaQueryList | undefined

function closeMobileSidebar() {
  mobileOpen.value = false
}

function syncMobileState(event: MediaQueryList | MediaQueryListEvent) {
  isMobile.value = event.matches
  if (!event.matches)
    closeMobileSidebar()
}

onMounted(() => {
  mobileMediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY)
  syncMobileState(mobileMediaQuery)
  mobileMediaQuery.addEventListener('change', syncMobileState)
})

onBeforeUnmount(() => {
  mobileMediaQuery?.removeEventListener('change', syncMobileState)
})
</script>

<template>
  <DialogRoot v-model:open="mobileOpen">
    <div :class="cn('flex h-screen w-full overflow-hidden bg-background text-foreground', props.class)">
      <Sidebar
        v-if="!isMobile"
        :class="cn('flex shrink-0', props.sidebarClass)"
      >
        <template v-if="$slots['sidebar-header']" #header>
          <slot name="sidebar-header" />
        </template>

        <slot name="sidebar" :close-mobile-sidebar="closeMobileSidebar" />

        <template v-if="$slots['sidebar-footer']" #footer>
          <slot name="sidebar-footer" />
        </template>
      </Sidebar>

      <div class="flex min-h-0 min-w-0 flex-1 flex-col">
        <header :class="cn('flex min-h-14 shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6', props.headerClass)">
          <DialogTrigger as-child>
            <button
              type="button"
              class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
              :aria-label="props.openNavigationLabel"
            >
              <span class="i-lucide-menu h-5 w-5" aria-hidden="true" />
            </button>
          </DialogTrigger>
          <div class="min-w-0 flex-1">
            <slot name="header" />
          </div>
        </header>

        <main :class="cn('min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-none', props.contentClass)">
          <slot />
        </main>
      </div>
    </div>

    <DialogPortal v-if="isMobile">
      <DialogOverlay
        class="fixed inset-0 z-40 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />
      <DialogContent
        :aria-label="props.mobileSidebarLabel"
        class="fixed inset-y-0 left-0 z-50 w-64 max-w-[80vw] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
      >
        <VisuallyHidden>
          <DialogTitle>{{ props.mobileSidebarLabel }}</DialogTitle>
          <DialogDescription>Application navigation menu</DialogDescription>
        </VisuallyHidden>

        <Sidebar :class="cn('h-full w-full border-r-0', props.sidebarClass)">
          <template v-if="$slots['sidebar-header']" #header>
            <slot name="sidebar-header" />
          </template>

          <slot name="sidebar" :close-mobile-sidebar="closeMobileSidebar" />

          <template v-if="$slots['sidebar-footer']" #footer>
            <slot name="sidebar-footer" />
          </template>
        </Sidebar>

        <DialogClose as-child>
          <button
            type="button"
            class="absolute -right-12 top-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            :aria-label="props.closeNavigationLabel"
          >
            <span class="i-lucide-x h-5 w-5" aria-hidden="true" />
          </button>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
