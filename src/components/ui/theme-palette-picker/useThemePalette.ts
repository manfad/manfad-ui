import { onMounted, readonly, shallowRef } from 'vue'
import {
  isManfadUiPaletteName,
  type ManfadUiPaletteName,
} from '@/theme/palettes'

interface UseThemePaletteOptions {
  storageKey?: string
}

export function useThemePalette(options: UseThemePaletteOptions = {}) {
  const storageKey = options.storageKey ?? 'manfad-ui-theme'
  const componentTheme = shallowRef<ManfadUiPaletteName>('blue')
  const backgroundTheme = shallowRef<ManfadUiPaletteName>('blue')

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

  onMounted(() => {
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
  })

  return {
    componentTheme: readonly(componentTheme),
    backgroundTheme: readonly(backgroundTheme),
    setComponentTheme,
    setBackgroundTheme,
  }
}
