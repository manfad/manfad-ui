export const manfadUiPaletteNames = [
  'neutral',
  'blue',
  'green',
  'orange',
  'rose',
  'violet',
  'teal',
  'white',
] as const

export type ManfadUiPaletteName = typeof manfadUiPaletteNames[number]

type ThemeVariables = Record<string, string>

interface ThemeMode {
  light: ThemeVariables
  dark: ThemeVariables
}

export interface ManfadUiPalette {
  name: ManfadUiPaletteName
  label: string
  component: ThemeMode
  background: ThemeMode
  /**
   * Offered as a background only. The palette still carries a full component
   * theme so the type stays total and a stale stored selection resolves to
   * something valid rather than leaving the document unstyled.
   */
  backgroundOnly?: boolean
  /** The mirror of `backgroundOnly`: offered as a component theme only. */
  componentOnly?: boolean
  /**
   * Swatch shown by `ThemeSwitcher`, when the background's accent tint is
   * not a fair likeness of the palette.
   */
  swatch?: string
}

/** `[color, foreground]`, both raw hsl triples. */
type ColorPair = [string, string]

interface ComponentColors {
  primary: ColorPair
  secondary: ColorPair
  tertiary: ColorPair
  /**
   * The palette's opposing accent — a hue that contrasts with `primary` rather
   * than extending it, for the one element on a screen that has to argue with
   * everything around it.
   */
  rival: ColorPair
  /** Series colors for data visualization, `--chart-1` through `--chart-5`. */
  chart: [string, string, string, string, string]
}

function componentTheme(light: ComponentColors, dark: ComponentColors): ThemeMode {
  const toVariables = ({ primary, secondary, tertiary, rival, chart }: ComponentColors): ThemeVariables => ({
    primary: primary[0],
    'primary-foreground': primary[1],
    secondary: secondary[0],
    'secondary-foreground': secondary[1],
    tertiary: tertiary[0],
    'tertiary-foreground': tertiary[1],
    rival: rival[0],
    'rival-foreground': rival[1],
    ring: primary[0],
    ...Object.fromEntries(chart.map((color, index) => [`chart-${index + 1}`, color])),
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

/** Shared by the neutral palette and the background-only white palette. */
const neutralComponent = componentTheme(
  {
    primary: ['240 5.9% 10%', '0 0% 98%'],
    secondary: ['240 4.8% 95.9%', '240 5.9% 10%'],
    tertiary: ['215 19% 42%', '0 0% 98%'],
    rival: ['0 0% 100%', '240 6% 10%'],
    chart: ['215 25% 35%', '25 55% 48%', '190 45% 38%', '340 40% 50%', '145 30% 38%'],
  },
  {
    primary: ['0 0% 98%', '240 5.9% 10%'],
    secondary: ['240 3.7% 15.9%', '0 0% 98%'],
    tertiary: ['215 20% 65%', '222.2 47.4% 11.2%'],
    rival: ['240 6% 10%', '0 0% 98%'],
    chart: ['215 25% 68%', '25 65% 62%', '190 50% 55%', '340 50% 65%', '145 38% 55%'],
  },
)

/**
 * Untinted surfaces, for screens that want the palette to show only in the
 * components. Written out rather than derived from `backgroundTheme`, whose
 * lightness ramp is built for tints and never reaches pure white.
 */
const whiteBackground: ThemeMode = {
  light: {
    background: '0 0% 100%',
    foreground: '222.2 47.4% 11.2%',
    card: '0 0% 100%',
    'card-foreground': '222.2 47.4% 11.2%',
    popover: '0 0% 100%',
    'popover-foreground': '222.2 47.4% 11.2%',
    muted: '0 0% 96%',
    'muted-foreground': '0 0% 40%',
    accent: '0 0% 94%',
    'accent-foreground': '222.2 47.4% 11.2%',
    border: '0 0% 90%',
    input: '0 0% 90%',
    sidebar: '0 0% 98%',
    'sidebar-foreground': '222.2 47.4% 11.2%',
    'sidebar-accent': '0 0% 94%',
    'sidebar-accent-foreground': '222.2 47.4% 11.2%',
    'sidebar-border': '0 0% 90%',
  },
  dark: {
    background: '0 0% 7%',
    foreground: '0 0% 98%',
    card: '0 0% 10%',
    'card-foreground': '0 0% 98%',
    popover: '0 0% 10%',
    'popover-foreground': '0 0% 98%',
    muted: '0 0% 16%',
    'muted-foreground': '0 0% 65%',
    accent: '0 0% 21%',
    'accent-foreground': '0 0% 98%',
    border: '0 0% 23%',
    input: '0 0% 23%',
    sidebar: '0 0% 9%',
    'sidebar-foreground': '0 0% 98%',
    'sidebar-accent': '0 0% 19%',
    'sidebar-accent-foreground': '0 0% 98%',
    'sidebar-border': '0 0% 23%',
  },
}

export const manfadUiPalettes: readonly ManfadUiPalette[] = [
  {
    name: 'neutral',
    label: 'Neutral',
    component: neutralComponent,
    background: backgroundTheme(220, 220, 6, 14),
  },
  {
    name: 'blue',
    label: 'Blue',
    component: componentTheme(
      {
        primary: ['221.2 83.2% 53.3%', '210 40% 98%'],
        secondary: ['214 95% 93%', '222.2 47.4% 11.2%'],
        tertiary: ['199 89% 33%', '0 0% 98%'],
        rival: ['0 72% 45%', '0 0% 98%'],
        chart: ['221 83% 48%', '0 72% 50%', '173 60% 38%', '43 90% 48%', '280 65% 55%'],
      },
      {
        primary: ['217.2 91.2% 59.8%', '222.2 47.4% 11.2%'],
        secondary: ['217 33% 18%', '210 40% 98%'],
        tertiary: ['198 93% 60%', '202 80% 12%'],
        rival: ['0 84% 65%', '0 60% 10%'],
        chart: ['217 91% 62%', '0 84% 65%', '173 62% 52%', '43 96% 60%', '280 75% 70%'],
      },
    ),
    background: backgroundTheme(214, 222),
  },
  {
    name: 'green',
    label: 'Green',
    component: componentTheme(
      {
        primary: ['142.1 76.2% 30%', '355.7 100% 97.3%'],
        secondary: ['138 60% 93%', '144.9 80.4% 10%'],
        tertiary: ['173 58% 28%', '0 0% 98%'],
        rival: ['348 80% 44%', '0 0% 98%'],
        chart: ['142 70% 33%', '348 78% 48%', '199 85% 42%', '43 90% 48%', '265 65% 58%'],
      },
      {
        primary: ['142.1 70.6% 55%', '144.9 80.4% 10%'],
        secondary: ['143 30% 18%', '0 0% 98%'],
        tertiary: ['173 58% 55%', '174 70% 10%'],
        rival: ['348 85% 63%', '346 70% 10%'],
        chart: ['142 65% 50%', '348 85% 63%', '199 88% 58%', '43 96% 60%', '265 75% 70%'],
      },
    ),
    background: backgroundTheme(138, 145, 70, 38),
  },
  {
    name: 'orange',
    label: 'Orange',
    component: componentTheme(
      {
        primary: ['24.6 95% 40%', '60 9.1% 97.8%'],
        secondary: ['30 100% 93%', '24 9.8% 10%'],
        tertiary: ['43 96% 50%', '26 83% 14%'],
        rival: ['215 85% 45%', '0 0% 98%'],
        chart: ['25 90% 48%', '215 85% 48%', '155 65% 34%', '338 75% 50%', '265 60% 58%'],
      },
      {
        primary: ['24.6 95% 60%', '24 70% 10%'],
        secondary: ['20 35% 18%', '60 9.1% 97.8%'],
        tertiary: ['43 96% 60%', '26 83% 14%'],
        rival: ['213 90% 62%', '215 60% 10%'],
        chart: ['25 95% 60%', '213 90% 63%', '155 60% 50%', '338 82% 65%', '265 72% 70%'],
      },
    ),
    background: backgroundTheme(30, 24, 100, 42),
  },
  {
    name: 'rose',
    label: 'Rose',
    component: componentTheme(
      {
        primary: ['346.8 77.2% 44%', '355.7 100% 97.3%'],
        secondary: ['345 80% 94%', '343 45% 15%'],
        tertiary: ['326 78% 42%', '0 0% 98%'],
        rival: ['172 78% 26%', '0 0% 98%'],
        chart: ['347 77% 47%', '172 78% 32%', '262 70% 56%', '38 92% 48%', '210 80% 48%'],
      },
      {
        primary: ['346.8 77.2% 62%', '343 70% 12%'],
        secondary: ['343 32% 18%', '0 0% 98%'],
        tertiary: ['326 85% 65%', '326 70% 12%'],
        rival: ['172 65% 50%', '174 70% 8%'],
        chart: ['347 80% 62%', '172 65% 50%', '262 75% 68%', '40 95% 60%', '210 88% 62%'],
      },
    ),
    background: backgroundTheme(345, 343, 85, 40),
  },
  {
    name: 'violet',
    label: 'Violet',
    component: componentTheme(
      {
        primary: ['262.1 83.3% 57.8%', '210 20% 98%'],
        secondary: ['258 90% 94%', '261 43% 18%'],
        tertiary: ['239 70% 58%', '210 20% 98%'],
        rival: ['42 96% 50%', '28 80% 12%'],
        chart: ['262 78% 55%', '45 93% 47%', '199 85% 42%', '330 75% 52%', '150 60% 36%'],
      },
      {
        primary: ['263.4 70% 50.4%', '210 20% 98%'],
        secondary: ['260 30% 19%', '210 20% 98%'],
        tertiary: ['239 75% 62%', '210 20% 98%'],
        rival: ['45 96% 60%', '36 80% 10%'],
        chart: ['263 75% 66%', '45 96% 60%', '199 88% 58%', '330 82% 66%', '150 55% 50%'],
      },
    ),
    background: backgroundTheme(258, 260, 90, 42),
  },
  {
    name: 'teal',
    label: 'Teal',
    component: componentTheme(
      {
        primary: ['174 84% 26%', '0 0% 98%'],
        secondary: ['172 60% 92%', '175 60% 14%'],
        tertiary: ['192 88% 30%', '0 0% 98%'],
        rival: ['8 78% 44%', '0 0% 98%'],
        chart: ['174 78% 30%', '8 78% 48%', '221 75% 50%', '43 90% 46%', '280 62% 55%'],
      },
      {
        primary: ['173 70% 52%', '175 80% 8%'],
        secondary: ['175 30% 18%', '0 0% 98%'],
        tertiary: ['192 85% 55%', '195 80% 10%'],
        rival: ['8 85% 65%', '8 60% 10%'],
        chart: ['173 65% 50%', '8 85% 65%', '217 88% 65%', '43 96% 60%', '280 72% 70%'],
      },
    ),
    // Never rendered — the picker offers teal as a component theme only. It
    // exists so the type stays total and a stale stored value still resolves.
    background: backgroundTheme(172, 178, 60, 38),
    componentOnly: true,
  },
  {
    name: 'white',
    label: 'White',
    component: neutralComponent,
    background: whiteBackground,
    backgroundOnly: true,
    // The accent tint every other swatch uses is a 94% grey here, which reads as
    // "slightly dirty" rather than "white". The button's border does the work.
    swatch: '0 0% 100%',
  },
]

export function isManfadUiPaletteName(value: string | null): value is ManfadUiPaletteName {
  return manfadUiPaletteNames.includes(value as ManfadUiPaletteName)
}

function declarations(variables: ThemeVariables): string {
  return Object.entries(variables)
    .map(([name, value]) => `  --${name}: ${value};`)
    .join('\n')
}

export function createManfadUiPaletteCss(darkSelector: string): string {
  const defaultPalette = manfadUiPalettes.find(palette => palette.name === 'blue')!
  const lightSelectors = manfadUiPalettes.map(palette => `
[data-manfad-component-theme="${palette.name}"] {
${declarations(palette.component.light)}
}
[data-manfad-background-theme="${palette.name}"] {
${declarations(palette.background.light)}
}`).join('')
  const darkSelectors = manfadUiPalettes.map(palette => `
${darkSelector}[data-manfad-component-theme="${palette.name}"] {
${declarations(palette.component.dark)}
}
${darkSelector}[data-manfad-background-theme="${palette.name}"] {
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
