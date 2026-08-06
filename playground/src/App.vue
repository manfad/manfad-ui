<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import { AppShell } from '@/components/ui/app-shell'
import { IconInput } from '@/components/ui/icon-input'
import { Mode, ModeToggle } from '@/components/ui/mode-toggle'
import { SidebarGroup, SidebarItem, SidebarSwitcher } from '@/components/ui/sidebar'
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
import { Confirmation } from '@/components/ui/alert-dialog'
import { Toaster } from '@/components/ui/toast'
import {
  componentSectionGroups,
  extraSectionGroups,
  extraSectionIds,
  playgroundSections,
  extraSections,
} from './sections'
import { useEmbed } from './use-embed'

type SwitcherMode = 'docs' | 'playground' | 'extra'

const route = useRoute()
const router = useRouter()
const isEmbed = useEmbed()

const docsNav = [
  { name: 'docs', label: 'Home' },
  { name: 'llms-txt', label: 'LLMs.txt' },
] as const

function modeForRoute(name: unknown): SwitcherMode {
  if (route.meta.mode === 'docs' || name === 'docs' || name === 'llms-txt')
    return 'docs'
  if (typeof name === 'string' && extraSectionIds.has(name))
    return 'extra'
  return 'playground'
}

const switcherValue = shallowRef<SwitcherMode>(modeForRoute(route.name))
const switcherItems = [
  { value: 'docs', label: 'Home' },
  { value: 'playground', label: 'Playground' },
  { value: 'extra', label: 'Extra' },
]
const lastPlaygroundPath = shallowRef('/buttons')
const lastExtraPath = shallowRef('/line-chart')

const activeSectionGroups = computed(() =>
  switcherValue.value === 'extra' ? extraSectionGroups : componentSectionGroups,
)

const activeSectionTotal = computed(() =>
  switcherValue.value === 'extra' ? extraSections.length : playgroundSections.length,
)

const sidebarFilter = shallowRef('')

const filteredSectionGroups = computed(() => {
  const query = sidebarFilter.value.trim().toLowerCase()
  if (!query)
    return activeSectionGroups.value

  return activeSectionGroups.value
    .map(group => ({
      ...group,
      sections: group.sections.filter(section =>
        section.label.toLowerCase().includes(query)
        || group.label.toLowerCase().includes(query),
      ),
    }))
    .filter(group => group.sections.length > 0)
})

const totalVisibleSections = computed(() =>
  filteredSectionGroups.value.reduce((sum, group) => sum + group.sections.length, 0),
)

watch(
  () => route.meta.title,
  (title) => {
    document.title = title ? `Manfad UI | ${title}` : 'Manfad UI'
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  (path) => {
    window.scrollTo(0, 0)
    const main = document.querySelector('main')
    main?.scrollTo({ top: 0 })

    const mode = modeForRoute(route.name)
    switcherValue.value = mode

    if (typeof path !== 'string' || mode === 'docs')
      return

    if (mode === 'extra')
      lastExtraPath.value = path
    else if (mode === 'playground')
      lastPlaygroundPath.value = path
  },
)

watch(switcherValue, (value) => {
  const current = modeForRoute(route.name)
  if (value === current)
    return

  if (value === 'docs') {
    void router.push({ name: 'docs' })
    return
  }

  if (value === 'extra') {
    void router.push(lastExtraPath.value)
    return
  }

  void router.push(lastPlaygroundPath.value)
})
</script>

<template>
  <!-- Bare mode for showcase iframes: no app chrome, just the demo + toasts. -->
  <template v-if="isEmbed">
    <div class="p-4">
      <RouterView />
    </div>
    <Toaster />
  </template>

  <AppShell v-else content-class="p-4 md:p-8">
    <template #sidebar-header>
      <SidebarSwitcher
        v-model="switcherValue"
        title="@manfad99/ui"
        icon="i-lucide-layers"
        :items="switcherItems"
      />
    </template>

    <template v-if="switcherValue !== 'docs'" #sidebar-toolbar>
      <IconInput
        v-model="sidebarFilter"
        start-icon="i-lucide-search"
        placeholder="Filter components…"
        aria-label="Filter component list"
      />
    </template>

    <template #sidebar="{ closeMobileSidebar }">
      <template v-if="switcherValue === 'docs'">
        <SidebarItem
          v-for="item in docsNav"
          :key="item.name"
          :as="RouterLink"
          class="w-full"
          :to="{ name: item.name }"
          :active="route.name === item.name"
          @click="closeMobileSidebar()"
        >
          {{ item.label }}
        </SidebarItem>
      </template>
      <template v-else>
        <SidebarGroup
          v-for="group in filteredSectionGroups"
          :key="group.id"
          :label="group.label"
          collapsible
        >
          <SidebarItem
            v-for="section in group.sections"
            :key="section.id"
            :as="RouterLink"
            class="w-full"
            :to="{ name: section.id }"
            :active="route.name === section.id"
            @click="closeMobileSidebar()"
          >
            {{ section.label }}
          </SidebarItem>
        </SidebarGroup>
        <p
          v-if="filteredSectionGroups.length === 0"
          class="px-3 py-2 text-sm text-muted-foreground"
        >
          No components match “{{ sidebarFilter }}”.
        </p>
      </template>
    </template>

    <template #sidebar-footer>
      <div class="space-y-4">
        <ThemeSwitcher />
        <p v-if="switcherValue !== 'docs'" class="text-xs text-muted-foreground">
          {{ totalVisibleSections }} of {{ activeSectionTotal }} components
        </p>
      </div>
    </template>

    <template #header>
      <div class="flex w-full items-center justify-between gap-3">
        <h1 class="truncate text-lg font-semibold tracking-tight">
          {{ route.meta.title ?? 'Component preview' }}
        </h1>
        <ModeToggle v-model="switcherValue" shortcut="d" class="shrink-0">
          <Mode value="docs">Home</Mode>
          <Mode value="playground">Playground</Mode>
          <Mode value="extra">Extra</Mode>
        </ModeToggle>
      </div>
    </template>

    <div :class="route.meta.wide ? 'mx-auto max-w-6xl space-y-8' : 'mx-auto max-w-3xl space-y-8'">
      <RouterView />
    </div>
    <Toaster />
    <Confirmation />
  </AppShell>
</template>
