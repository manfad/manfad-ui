<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

import { AppShell } from '@/components/ui/app-shell'
import { Autocomplete } from '@/components/ui/autocomplete'
import { SidebarGroup, SidebarItem, WorkspaceSwitcher } from '@/components/ui/sidebar'
import { ThemePalettePicker } from '@/components/ui/theme-palette-picker'
import { ConfirmDialog } from '@/components/ui/alert-dialog'
import { Toaster } from '@/components/ui/toast'
import { componentSectionGroups, componentSections } from './sections'

const route = useRoute()
const router = useRouter()

const switcherValue = shallowRef('playground')
const switcherItems = [
  { value: 'playground', label: 'Component playground' },
  { value: 'docs', label: 'Documentation' },
]

const sidebarFilter = shallowRef('')

const filteredSectionGroups = computed(() => {
  const query = sidebarFilter.value.trim().toLowerCase()
  if (!query)
    return componentSectionGroups

  return componentSectionGroups
    .map(group => ({
      ...group,
      sections: group.sections.filter(section =>
        section.label.toLowerCase().includes(query)
        || group.label.toLowerCase().includes(query),
      ),
    }))
    .filter(group => group.sections.length > 0)
})

const componentSectionLabels = componentSections.map(section => section.label)

const totalVisibleSections = computed(() =>
  filteredSectionGroups.value.reduce((sum, group) => sum + group.sections.length, 0),
)

function onSidebarSearchSelect(label: string, closeMobileSidebar: () => void): void {
  const section = componentSections.find(item => item.label === label)
  if (!section)
    return
  router.push({ name: section.id })
  closeMobileSidebar()
}

watch(
  () => route.meta.title,
  (title) => {
    document.title = title ? `${title} · @manfad/ui` : '@manfad/ui playground'
  },
  { immediate: true },
)

watch(
  () => route.fullPath,
  () => {
    window.scrollTo(0, 0)
    const main = document.querySelector('main')
    main?.scrollTo({ top: 0 })
  },
)
</script>

<template>
  <AppShell content-class="p-4 md:p-8">
    <template #sidebar-header>
      <WorkspaceSwitcher
        v-model="switcherValue"
        title="@manfad/ui"
        icon="i-lucide-layers"
        :items="switcherItems"
      />
    </template>

    <template #sidebar-toolbar="{ closeMobileSidebar }">
      <Autocomplete
        v-model="sidebarFilter"
        :options="componentSectionLabels"
        placeholder="Filter components…"
        aria-label="Filter component list"
        @select="onSidebarSearchSelect($event, closeMobileSidebar)"
      />
    </template>

    <template #sidebar="{ closeMobileSidebar }">
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

    <template #sidebar-footer>
      <div class="space-y-4">
        <ThemePalettePicker />
        <p class="text-xs text-muted-foreground">
          {{ totalVisibleSections }} of {{ componentSections.length }} components
        </p>
      </div>
    </template>

    <template #header>
      <h1 class="truncate text-lg font-semibold tracking-tight">
        {{ route.meta.title ?? 'Component preview' }}
      </h1>
    </template>

    <div class="mx-auto max-w-3xl space-y-8">
      <RouterView />
    </div>
    <Toaster />
    <ConfirmDialog />
  </AppShell>
</template>
