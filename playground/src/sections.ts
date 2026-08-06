export interface ComponentSection {
  id: string
  label: string
  /** Render the demo page in a wider content column (e.g. multi-panel showcases). */
  wide?: boolean
}

export interface ComponentSectionGroup {
  id: string
  label: string
  sections: ComponentSection[]
}

function byLabel(a: ComponentSection, b: ComponentSection) {
  return a.label.localeCompare(b.label)
}

export const componentSectionGroups: ComponentSectionGroup[] = [
  {
    id: 'primitive',
    label: 'Primitive',
    sections: [
      { id: 'accordion', label: 'Accordion' },
      { id: 'badges', label: 'Badge' },
      { id: 'buttons', label: 'Button' },
      { id: 'calendar', label: 'Calendar' },
      { id: 'card-sections', label: 'Card' },
      { id: 'checkbox', label: 'Checkbox' },
      { id: 'dialog', label: 'Dialog' },
      { id: 'dropdown', label: 'Dropdown' },
      { id: 'hover', label: 'Hover' },
      { id: 'image', label: 'Image' },
      { id: 'input', label: 'Input' },
      { id: 'list', label: 'List' },
      { id: 'mode-toggle', label: 'ModeToggle' },
      { id: 'popover', label: 'Popover' },
      { id: 'progress', label: 'Progress' },
      { id: 'radio', label: 'RadioGroup' },
      { id: 'row', label: 'Row' },
      { id: 'scroll-area', label: 'ScrollArea' },
      { id: 'select', label: 'Select' },
      { id: 'skeleton', label: 'Skeleton' },
      { id: 'spinner', label: 'Spinner' },
      { id: 'switch', label: 'Switch' },
      { id: 'table', label: 'Table' },
      { id: 'tabs', label: 'Tabs' },
      { id: 'textarea', label: 'Textarea' },
      { id: 'toast', label: 'Toast' },
      { id: 'toggle', label: 'Toggle' },
      { id: 'wheel', label: 'Wheel' },
    ].sort(byLabel),
  },
  {
    id: 'forms',
    label: 'Forms',
    sections: [
      { id: 'autocomplete', label: 'Autocomplete' },
      { id: 'checkbox-tree', label: 'CheckboxTree' },
      { id: 'choice', label: 'Choice' },
      { id: 'choice-card', label: 'ChoiceCard' },
      { id: 'calendar-range', label: 'DatePicker' },
      { id: 'date-filter', label: 'DateFilter' },
      { id: 'form-field', label: 'FormField' },
      { id: 'icon-input', label: 'IconInput' },
      { id: 'input-clear', label: 'InputClear' },
      { id: 'month-picker', label: 'MonthPicker' },
      { id: 'number-input', label: 'NumberInput' },
      { id: 'stepper', label: 'Stepper' },
      { id: 'time-picker', label: 'TimePicker' },
      { id: 'timetable', label: 'Timetable' },
    ].sort(byLabel),
  },
  {
    id: 'layout',
    label: 'Layout',
    sections: [
      { id: 'panes', label: 'PaneContainer', wide: true },
      { id: 'sidebar-groups', label: 'Sidebar' },
      { id: 'sidebar-switcher', label: '@manfad99/ui' },
      { id: 'theme-palette', label: 'ThemePalette' },
      { id: 'theme-switcher', label: 'ThemeSwitcher' },
    ].sort(byLabel),
  },
  {
    id: 'feedback',
    label: 'Feedback',
    sections: [
      { id: 'confirmation', label: 'Confirmation' },
      { id: 'empty', label: 'Empty' },
      { id: 'error', label: 'ErrorPage' },
      { id: 'error-pages', label: 'Error pages', wide: true },
      { id: 'loading-dialog', label: 'LoadingDialog' },
      { id: 'no-permission', label: 'NoPermissionPage' },
      { id: 'page-loading', label: 'PageLoading' },
      { id: 'unauthorized', label: 'UnauthorizedPage' },
    ].sort(byLabel),
  },
  {
    id: 'content',
    label: 'Content',
    sections: [
      { id: 'attachment', label: 'Attachment' },
      { id: 'big-calendar', label: 'BigCalendar' },
      { id: 'code-block', label: 'CodeBlock' },
      { id: 'filter', label: 'Filter' },
      { id: 'gallery', label: 'Gallery' },
      { id: 'selection-chips', label: 'SelectionChips' },
      { id: 'signature-pad', label: 'SignaturePad' },
      { id: 'timeline', label: 'Timeline' },
    ].sort(byLabel),
  },
  {
    id: 'tables',
    label: 'Tables',
    sections: [
      { id: 'check-table', label: 'CheckTable' },
      { id: 'collapsible-table', label: 'CollapsibleTable' },
      { id: 'data-table', label: 'DataTable' },
      { id: 'editable-table', label: 'EditableTable' },
      { id: 'expandable-table', label: 'Expandable' },
      { id: 'grouped-table', label: 'GroupedTable' },
    ].sort(byLabel),
  },
]

/** Optional DLC surfaces that need peer deps (`@manfad99/ui/chart`, `/excel`, etc.). */
export const extraSectionGroups: ComponentSectionGroup[] = [
  {
    id: 'charts',
    label: 'Charts',
    sections: [
      { id: 'area-chart', label: 'AreaChart' },
      { id: 'bar-chart', label: 'BarChart' },
      { id: 'donut-chart', label: 'DonutChart' },
      { id: 'line-chart', label: 'LineChart' },
    ].sort(byLabel),
  },
  {
    id: 'add-ons',
    label: 'Add-ons',
    sections: [
      { id: 'excel', label: 'Excel' },
      { id: 'md-view', label: 'MdView' },
      { id: 'time-badge', label: 'TimeBadge' },
    ].sort(byLabel),
  },
]

export const playgroundSections: ComponentSection[] = componentSectionGroups.flatMap(
  group => group.sections,
)

export const extraSections: ComponentSection[] = extraSectionGroups.flatMap(
  group => group.sections,
)

export const componentSections: ComponentSection[] = [
  ...playgroundSections,
  ...extraSections,
]

export const extraSectionIds = new Set(extraSections.map(section => section.id))

export type ComponentSectionId = typeof componentSections[number]['id']
