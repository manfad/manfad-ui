import { onMounted, readonly, shallowRef } from 'vue'
import {
  isYfUiPaletteName,
  type YfUiPaletteName,
} from '@/theme/palettes'

interface UseThemePaletteOptions {
  storageKey?: string
}

export function useThemePalette(options: UseThemePaletteOptions = {}) {
  const storageKey = options.storageKey ?? 'yf-ui-theme'
  const componentTheme = shallowRef<YfUiPaletteName>('blue')
  const backgroundTheme = shallowRef<YfUiPaletteName>('blue')

  function applyTheme(kind: 'component' | 'background', value: YfUiPaletteName) {
    if (typeof document === 'undefined')
      return

    document.documentElement.dataset[`yf${kind === 'component' ? 'Component' : 'Background'}Theme`] = value
  }

  function persist() {
    if (typeof localStorage === 'undefined')
      return

    localStorage.setItem(storageKey, JSON.stringify({
      component: componentTheme.value,
      background: backgroundTheme.value,
    }))
  }

  function setComponentTheme(value: YfUiPaletteName) {
    componentTheme.value = value
    applyTheme('component', value)
    persist()
  }

  function setBackgroundTheme(value: YfUiPaletteName) {
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
      if (isYfUiPaletteName(savedComponent))
        componentTheme.value = savedComponent
      if (isYfUiPaletteName(savedBackground))
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
