import { onMounted, readonly, shallowRef, type DeepReadonly, type ShallowRef } from 'vue'
import {
  isManfadUiPaletteName,
  type ManfadUiPaletteName,
} from '@/theme/palettes'

interface UseThemePaletteOptions {
  storageKey?: string
}

interface ThemePaletteStore {
  componentTheme: DeepReadonly<ShallowRef<ManfadUiPaletteName>>
  backgroundTheme: DeepReadonly<ShallowRef<ManfadUiPaletteName>>
  setComponentTheme: (value: ManfadUiPaletteName) => void
  setBackgroundTheme: (value: ManfadUiPaletteName) => void
  hydrate: () => void
}

const stores = new Map<string, ThemePaletteStore>()

function createStore(storageKey: string): ThemePaletteStore {
  const componentTheme = shallowRef<ManfadUiPaletteName>('blue')
  const backgroundTheme = shallowRef<ManfadUiPaletteName>('blue')
  let hydrated = false

  function applyTheme(kind: 'component' | 'background', value: ManfadUiPaletteName) {
    if (typeof document === 'undefined')
      return

    document.documentElement.dataset[`manfad${kind === 'component' ? 'Component' : 'Background'}Theme`] = value
  }

  function persist() {
    if (typeof localStorage === 'undefined')
      return

    localStorage.setItem(storageKey, JSON.stringify({
      component: componentTheme.value,
      background: backgroundTheme.value,
    }))
  }

  function setComponentTheme(value: ManfadUiPaletteName) {
    componentTheme.value = value
    applyTheme('component', value)
    persist()
  }

  function setBackgroundTheme(value: ManfadUiPaletteName) {
    backgroundTheme.value = value
    applyTheme('background', value)
    persist()
  }

  function hydrate() {
    if (hydrated)
      return

    hydrated = true

    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}') as {
        component?: string
        background?: string
      }
      const savedComponent = saved.component ?? null
      const savedBackground = saved.background ?? null
      if (isManfadUiPaletteName(savedComponent))
        componentTheme.value = savedComponent
      if (isManfadUiPaletteName(savedBackground))
        backgroundTheme.value = savedBackground
    }
    catch {
      localStorage.removeItem(storageKey)
    }

    applyTheme('component', componentTheme.value)
    applyTheme('background', backgroundTheme.value)
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== storageKey || event.newValue == null)
        return

      try {
        const saved = JSON.parse(event.newValue) as {
          component?: string
          background?: string
        }
        const savedComponent = saved.component ?? null
        const savedBackground = saved.background ?? null
        if (isManfadUiPaletteName(savedComponent)) {
          componentTheme.value = savedComponent
          applyTheme('component', savedComponent)
        }
        if (isManfadUiPaletteName(savedBackground)) {
          backgroundTheme.value = savedBackground
          applyTheme('background', savedBackground)
        }
      }
      catch {
        // ignore malformed cross-tab payloads
      }
    })
  }

  return {
    componentTheme: readonly(componentTheme),
    backgroundTheme: readonly(backgroundTheme),
    setComponentTheme,
    setBackgroundTheme,
    hydrate,
  }
}

function getStore(storageKey: string) {
  let store = stores.get(storageKey)

  if (!store) {
    store = createStore(storageKey)
    stores.set(storageKey, store)
  }

  return store
}

/** Shared per `storageKey` so every ThemeSwitcher stays in sync. */
export function useThemePalette(options: UseThemePaletteOptions = {}) {
  const storageKey = options.storageKey ?? 'manfad-ui-theme'
  const store = getStore(storageKey)

  onMounted(() => {
    store.hydrate()
  })

  return {
    componentTheme: store.componentTheme,
    backgroundTheme: store.backgroundTheme,
    setComponentTheme: store.setComponentTheme,
    setBackgroundTheme: store.setBackgroundTheme,
  }
}
