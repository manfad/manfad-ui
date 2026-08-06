export interface CalendarDay {
  date: Date
  value: string
  isCurrentMonth: boolean
  isSelected: boolean
  isToday: boolean
  isRestday: boolean
  isExcluded: boolean
  isDisabled: boolean
  isInRange?: boolean
  isRangeStart?: boolean
  isRangeEnd?: boolean
}
