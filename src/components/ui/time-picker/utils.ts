export interface TimeParts {
  hour24: number
  minute: number
}

export function parseTime(value: string): TimeParts | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match)
    return null

  const hour24 = Number(match[1])
  const minute = Number(match[2])

  if (hour24 < 0 || hour24 > 23 || minute < 0 || minute > 59)
    return null

  return { hour24, minute }
}

export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatCanonical(hour24: number, minute: number): string {
  return `${pad2(hour24)}:${pad2(minute)}`
}

/** Convert a 24h hour into { hour12, period }. */
export function to12h(hour24: number): { hour12: number, period: 'AM' | 'PM' } {
  const period = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
  return { hour12, period }
}

/** Convert a 12h hour + period into a 24h hour. */
export function to24h(hour12: number, period: 'AM' | 'PM'): number {
  const base = hour12 % 12
  return period === 'PM' ? base + 12 : base
}
