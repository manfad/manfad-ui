export const yfUiPaletteNames = [
  'neutral',
  'blue',
  'green',
  'orange',
  'rose',
  'violet',
] as const

export type YfUiPaletteName = typeof yfUiPaletteNames[number]

type ThemeVariables = Record<string, string>

interface ThemeMode {
  light: ThemeVariables
  dark: ThemeVariables
}

export interface YfUiPalette {
  name: YfUiPaletteName
  label: string
  component: ThemeMode
  background: ThemeMode
}

function componentTheme(
  light: [string, string, string, string, string, string],
  dark: [string, string, string, string, string, string],
): ThemeMode {
  const toVariables = ([primary, primaryForeground, secondary, secondaryForeground, tertiary, tertiaryForeground]: typeof light) => ({
    primary,
    'primary-foreground': primaryForeground,
    secondary,
    'secondary-foreground': secondaryForeground,
    tertiary,
    'tertiary-foreground': tertiaryForeground,
    ring: primary,
  })

  return {
    light: toVariables(light),
    dark: toVariables(dark),
  }
}

function backgroundTheme(
  lightHue: number,
  darkHue: number,
  lightSaturation = 100,
  darkSaturation = 47,
): ThemeMode {
  const lightForeground = '222.2 47.4% 11.2%'
  const darkForeground = '210 40% 98%'

  return {
    light: {
      background: `${lightHue} ${lightSaturation}% 97%`,
      foreground: lightForeground,
      card: `${lightHue} ${lightSaturation}% 99%`,
      'card-foreground': lightForeground,
      popover: `${lightHue} ${lightSaturation}% 99%`,
      'popover-foreground': lightForeground,
      muted: `${lightHue} ${Math.round(lightSaturation * 0.6)}% 94%`,
      'muted-foreground': `${darkHue} 20% 40%`,
      accent: `${lightHue} ${lightSaturation}% 92%`,
      'accent-foreground': lightForeground,
      border: `${lightHue} ${Math.round(lightSaturation * 0.6)}% 85%`,
      input: `${lightHue} ${Math.round(lightSaturation * 0.6)}% 85%`,
      sidebar: `${lightHue} ${lightSaturation}% 95%`,
      'sidebar-foreground': lightForeground,
      'sidebar-accent': `${lightHue} ${lightSaturation}% 90%`,
      'sidebar-accent-foreground': lightForeground,
      'sidebar-border': `${lightHue} ${Math.round(lightSaturation * 0.6)}% 84%`,
    },
    dark: {
      background: `${darkHue} ${darkSaturation}% 8%`,
      foreground: darkForeground,
      card: `${darkHue} ${Math.max(darkSaturation - 5, 0)}% 11%`,
      'card-foreground': darkForeground,
      popover: `${darkHue} ${Math.max(darkSaturation - 5, 0)}% 11%`,
      'popover-foreground': darkForeground,
      muted: `${darkHue} ${Math.max(darkSaturation - 17, 0)}% 17%`,
      'muted-foreground': `${darkHue} 20% 67%`,
      accent: `${darkHue} ${Math.max(darkSaturation - 12, 0)}% 22%`,
      'accent-foreground': darkForeground,
      border: `${darkHue} ${Math.max(darkSaturation - 17, 0)}% 24%`,
      input: `${darkHue} ${Math.max(darkSaturation - 17, 0)}% 24%`,
      sidebar: `${darkHue} ${darkSaturation}% 10%`,
      'sidebar-foreground': darkForeground,
      'sidebar-accent': `${darkHue} ${Math.max(darkSaturation - 12, 0)}% 20%`,
      'sidebar-accent-foreground': darkForeground,
      'sidebar-border': `${darkHue} ${Math.max(darkSaturation - 17, 0)}% 24%`,
    },
  }
}

export const yfUiPalettes: readonly YfUiPalette[] = [
  {
    name: 'neutral',
    label: 'Neutral',
    component: componentTheme(
      ['240 5.9% 10%', '0 0% 98%', '240 4.8% 95.9%', '240 5.9% 10%', '215 16% 47%', '0 0% 98%'],
      ['0 0% 98%', '240 5.9% 10%', '240 3.7% 15.9%', '0 0% 98%', '215 20% 65%', '222.2 47.4% 11.2%'],
    ),
    background: backgroundTheme(220, 220, 6, 14),
  },
  {
    name: 'blue',
    label: 'Blue',
    component: componentTheme(
      ['221.2 83.2% 53.3%', '210 40% 98%', '214 95% 93%', '222.2 47.4% 11.2%', '199 89% 38%', '0 0% 98%'],
      ['217.2 91.2% 59.8%', '222.2 47.4% 11.2%', '217 33% 18%', '210 40% 98%', '198 93% 60%', '202 80% 12%'],
    ),
    background: backgroundTheme(214, 222),
  },
  {
    name: 'green',
    label: 'Green',
    component: componentTheme(
      ['142.1 76.2% 30%', '355.7 100% 97.3%', '138 60% 93%', '144.9 80.4% 10%', '173 58% 28%', '0 0% 98%'],
      ['142.1 70.6% 55%', '144.9 80.4% 10%', '143 30% 18%', '0 0% 98%', '173 58% 55%', '174 70% 10%'],
    ),
    background: backgroundTheme(138, 145, 70, 38),
  },
  {
    name: 'orange',
    label: 'Orange',
    component: componentTheme(
      ['24.6 95% 40%', '60 9.1% 97.8%', '30 100% 93%', '24 9.8% 10%', '43 90% 38%', '26 83% 14%'],
      ['24.6 95% 60%', '24 70% 10%', '20 35% 18%', '60 9.1% 97.8%', '43 96% 60%', '26 83% 14%'],
    ),
    background: backgroundTheme(30, 24, 100, 42),
  },
  {
    name: 'rose',
    label: 'Rose',
    component: componentTheme(
      ['346.8 77.2% 44%', '355.7 100% 97.3%', '345 80% 94%', '343 45% 15%', '326 78% 42%', '0 0% 98%'],
      ['346.8 77.2% 62%', '343 70% 12%', '343 32% 18%', '0 0% 98%', '326 85% 65%', '326 70% 12%'],
    ),
    background: backgroundTheme(345, 343, 85, 40),
  },
  {
    name: 'violet',
    label: 'Violet',
    component: componentTheme(
      ['262.1 83.3% 57.8%', '210 20% 98%', '258 90% 94%', '261 43% 18%', '239 84% 67%', '240 60% 12%'],
      ['263.4 70% 50.4%', '210 20% 98%', '260 30% 19%', '210 20% 98%', '239 84% 72%', '240 60% 12%'],
    ),
    background: backgroundTheme(258, 260, 90, 42),
  },
]

export function isYfUiPaletteName(value: string | null): value is YfUiPaletteName {
  return yfUiPaletteNames.includes(value as YfUiPaletteName)
}

function declarations(variables: ThemeVariables): string {
  return Object.entries(variables)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n')
}

export function createYfUiPaletteCss(darkSelector: string): string {
  const defaultPalette = yfUiPalettes.find(palette => palette.name === 'blue')!
  const lightSelectors = yfUiPalettes.map(palette => `
[data-yf-component-theme="${palette.name}"] {
${declarations(palette.component.light)}
}
[data-yf-background-theme="${palette.name}"] {
${declarations(palette.background.light)}
}`).join('')
  const darkSelectors = yfUiPalettes.map(palette => `
${darkSelector}[data-yf-component-theme="${palette.name}"] {
${declarations(palette.component.dark)}
}
${darkSelector}[data-yf-background-theme="${palette.name}"] {
${declarations(palette.background.dark)}
}`).join('')

  return `:root {
${declarations({ ...defaultPalette.component.light, ...defaultPalette.background.light })}
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-ring: var(--ring);
}
${lightSelectors}
${darkSelector} {
${declarations({ ...defaultPalette.component.dark, ...defaultPalette.background.dark })}
}
${darkSelectors}`
}
