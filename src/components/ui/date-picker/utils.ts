export function formatDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/** A day of the week: a JS `getDay()` index (0=Sunday…6=Saturday) or a day name (full or 3-letter, case-insensitive). */
export type RestDay = number | string

const DAY_NAME_TO_INDEX: Record<string, number> = {
  sunday: 0,
  sun: 0,
  monday: 1,
  mon: 1,
  tuesday: 2,
  tue: 2,
  wednesday: 3,
  wed: 3,
  thursday: 4,
  thu: 4,
  friday: 5,
  fri: 5,
  saturday: 6,
  sat: 6,
}

/** Normalize a restday list (getDay() numbers and/or day names) to a Set of getDay() indices. */
export function normalizeRestday(restday?: RestDay[]): Set<number> {
  const result = new Set<number>()

  if (!restday)
    return result

  for (const entry of restday) {
    if (typeof entry === 'number') {
      if (Number.isInteger(entry) && entry >= 0 && entry <= 6)
        result.add(entry)

      continue
    }

    const index = DAY_NAME_TO_INDEX[entry.trim().toLowerCase()]

    if (index !== undefined)
      result.add(index)
  }

  return result
}

/** Normalize an exclude value to a Set of YYYY-MM-DD strings. A string is split on commas; entries are trimmed and empties ignored. */
export function normalizeExclude(exclude?: string | string[]): Set<string> {
  const result = new Set<string>()

  if (!exclude)
    return result

  const entries = Array.isArray(exclude) ? exclude : exclude.split(',')

  for (const entry of entries) {
    const trimmed = entry.trim()

    if (trimmed)
      result.add(trimmed)
  }

  return result
}

export function parseDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)

  if (!match)
    return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  const day = Number(match[3])
  const date = new Date(0)

  date.setHours(0, 0, 0, 0)
  date.setFullYear(year, month, day)

  if (
    date.getFullYear() !== year
    || date.getMonth() !== month
    || date.getDate() !== day
  ) {
    return null
  }

  return date
}
