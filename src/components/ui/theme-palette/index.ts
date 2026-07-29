export { default as ThemePalette } from './ThemePalette.vue'

export const manfadUiThemeTokens = [
  'primary',
  'secondary',
  'tertiary',
  'rival',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'background',
  'muted',
  'accent',
  'border',
] as const

export type ManfadUiThemeToken = typeof manfadUiThemeTokens[number]

/**
 * The roles that give a palette its character. The surface tokens are offered
 * through the `tokens` prop but stay out of the default set, where they would
 * read as four grey squares next to the colors worth looking at.
 */
export const manfadUiThemeTokenDefaults: readonly ManfadUiThemeToken[] = [
  'primary',
  'secondary',
  'tertiary',
  'rival',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
]

/**
 * Spelled out as literal class names because UnoCSS generates utilities by
 * scanning source text — a computed `bg-${token}` would never be built. Chart
 * series are absent on purpose; they have no paired foreground and no utility,
 * so `ThemePalette` reads them from the custom property instead.
 */
export const manfadUiThemeTokenClasses: Partial<Record<ManfadUiThemeToken, string>> = {
  'primary': 'bg-primary',
  'secondary': 'bg-secondary',
  'tertiary': 'bg-tertiary',
  'rival': 'bg-rival',
  'background': 'bg-background',
  'muted': 'bg-muted',
  'accent': 'bg-accent',
  'border': 'bg-border',
}
