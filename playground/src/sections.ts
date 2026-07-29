export interface ComponentSection {
  id: string
  label: string
}

export interface ComponentSectionGroup {
  id: string
  label: string
  sections: ComponentSection[]
}

export const componentSectionGroups: ComponentSectionGroup[] = [
  {
    id: 'foundations',
    label: 'Foundations',
    sections: [
      { id: 'buttons', label: 'Buttons' },
      { id: 'badges', label: 'Badges' },
      { id: 'badge-summary', label: 'Badge summary' },
      { id: 'theme-palette', label: 'Theme palette' },
      { id: 'theme-switcher', label: 'Theme switcher' },
      { id: 'code-block', label: 'CodeBlock' },
      { id: 'card-sections', label: 'Card borders' },
    ],
  },
  {
    id: 'forms',
    label: 'Forms',
    sections: [
      { id: 'form-controls', label: 'Form controls' },
      { id: 'form-field', label: 'Form field' },
      { id: 'number-input', label: 'Number & textarea' },
      { id: 'icon-input', label: 'Icon input' },
      { id: 'checkbox-tree', label: 'Checkbox tree' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date & time',
    sections: [
      { id: 'pickers', label: 'Time & wheel picker' },
      { id: 'calendar-range', label: 'Date range picker' },
      { id: 'month-picker', label: 'Month picker' },
      { id: 'big-calendar', label: 'Big calendar' },
      { id: 'timetable', label: 'Timetable' },
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    sections: [
      { id: 'tabs', label: 'Tabs' },
      { id: 'accordion', label: 'Accordion' },
      { id: 'sidebar-groups', label: 'Sidebar groups' },
      { id: 'stepper', label: 'Stepper' },
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    sections: [
      { id: 'overlays', label: 'Dialog & popover' },
      { id: 'hover-card', label: 'Hover card' },
      { id: 'dropdown-menu', label: 'Dropdown menu' },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    sections: [
      { id: 'progress', label: 'Progress & spinner' },
      { id: 'feedback', label: 'Toast & confirmation' },
      { id: 'skeleton-empty', label: 'Skeleton & empty state' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    sections: [
      { id: 'scroll-area', label: 'Scroll area' },
      { id: 'list', label: 'List' },
      { id: 'row', label: 'Row' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    sections: [
      { id: 'attachment', label: 'Attachment & dropzone' },
      { id: 'signature-pad', label: 'Signature pad' },
      { id: 'timeline', label: 'Timeline' },
    ],
  },
  {
    id: 'tables',
    label: 'Tables',
    sections: [
      { id: 'table', label: 'Table' },
      { id: 'data-table', label: 'Data table' },
      { id: 'grouped-table', label: 'Grouped table' },
      { id: 'editable-table', label: 'Editable table' },
      { id: 'expandable-table', label: 'Expandable table' },
      { id: 'check-table', label: 'Check table' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    sections: [
      { id: 'charts', label: 'Charts' },
    ],
  },
]

export const componentSections: ComponentSection[] = componentSectionGroups.flatMap(
  group => group.sections,
)

export type ComponentSectionId = typeof componentSections[number]['id']
