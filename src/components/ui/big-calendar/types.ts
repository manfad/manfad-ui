export type BigCalendarWeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface BigCalendarDay {
  date: Date
  value: string
  dayNumber: number
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  isInRange?: boolean
}
