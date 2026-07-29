<script setup lang="ts">
import { ref, shallowRef } from 'vue'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { AppShell } from '@/components/ui/app-shell'
import { Attachment, AttachmentList, Dropzone } from '@/components/ui/attachment'
import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { BigCalendar } from '@/components/ui/big-calendar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AreaChart, BarChart, DonutChart, LineChart } from '@/components/ui/chart'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EmptyState } from '@/components/ui/empty-state'
import { FormField } from '@/components/ui/form-field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { MonthPicker } from '@/components/ui/month-picker'
import { NumberInput } from '@/components/ui/number-input'
import { Pagination } from '@/components/ui/pagination'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Stepper, type StepperStep } from '@/components/ui/stepper'
import { TableFooterBar } from '@/components/ui/table-footer-bar'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { SignatureDialog, SignaturePad } from '@/components/ui/signature-pad'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleButton } from '@/components/ui/toggle-button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckboxTree } from '@/components/ui/checkbox-tree'
import { DatePicker } from '@/components/ui/date-picker'
import {
  GroupedTable,
  type GroupedTableGroup,
  type GroupedTableRowEdits,
  type GroupedTableSave,
} from '@/components/ui/grouped-table'
import { IconInput } from '@/components/ui/icon-input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  inputGroupInputClass,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { List, ListItem } from '@/components/ui/list'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Row, RowItem } from '@/components/ui/row'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarGroup, SidebarItem, WorkspaceSwitcher } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TimePicker } from '@/components/ui/time-picker'
import { Timetable, type TimetableOrientation } from '@/components/ui/timetable'
import { ThemePalettePicker } from '@/components/ui/theme-palette-picker'
import { WheelPicker, WheelPickerColumn } from '@/components/ui/wheel-picker'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast, Toaster } from '@/components/ui/toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  confirm,
  ConfirmDialog,
} from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { Expandable } from '@/components/ui/expandable-table'
import { CheckTable } from '@/components/ui/check-table'
import { cn } from '@/lib/utils'

const inputValue = shallowRef('')
const dialogValue = shallowRef('')
const amount = shallowRef('')
const notificationsEnabled = shallowRef(false)
const autoSaveEnabled = shallowRef(true)
const selectedDate = shallowRef('')
const selectedWorkday = shallowRef('')
const selectedBigCalendarDate = shallowRef('')
const selectedCountry = shallowRef('')
const selectedCity = shallowRef('')
const cityOptions = ['Kuching', 'Kota Kinabalu', 'Kuala Lumpur', 'Penang', 'Ipoh', 'Johor Bahru']
const selectedRange = shallowRef('week')
const time12 = shallowRef('14:30')
const time24 = shallowRef('09:15')
const wheelValue = shallowRef('Kuching')
const timetableOrientation = shallowRef<TimetableOrientation>('vertical')
const activeComponentSection = shallowRef('buttons')

const componentSections = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'badges', label: 'Badges' },
  { id: 'form-controls', label: 'Form controls' },
  { id: 'form-field', label: 'Form field' },
  { id: 'number-input', label: 'Number & textarea' },
  { id: 'icon-input', label: 'Icon input' },
  { id: 'checkbox-tree', label: 'Checkbox tree' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'pickers', label: 'Time & wheel picker' },
  { id: 'accordion', label: 'Accordion' },
  { id: 'sidebar-groups', label: 'Sidebar groups' },
  { id: 'progress', label: 'Progress & spinner' },
  { id: 'stepper', label: 'Stepper' },
  { id: 'attachment', label: 'Attachment & dropzone' },
  { id: 'hover-card', label: 'Hover card' },
  { id: 'dropdown-menu', label: 'Dropdown menu' },
  { id: 'scroll-area', label: 'Scroll area' },
  { id: 'card-sections', label: 'Card borders' },
  { id: 'calendar-range', label: 'Date range picker' },
  { id: 'month-picker', label: 'Month picker' },
  { id: 'big-calendar', label: 'Big calendar' },
  { id: 'overlays', label: 'Dialog & popover' },
  { id: 'feedback', label: 'Toast & confirmation' },
  { id: 'skeleton-empty', label: 'Skeleton & empty state' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'signature-pad', label: 'Signature pad' },
  { id: 'charts', label: 'Charts' },
  { id: 'table', label: 'Table' },
  { id: 'data-table', label: 'Data table' },
  { id: 'grouped-table', label: 'Grouped table' },
  { id: 'editable-table', label: 'Editable table' },
  { id: 'expandable-table', label: 'Expandable table' },
  { id: 'check-table', label: 'Check table' },
  { id: 'pagination', label: 'Pagination & footer bar' },
  { id: 'timetable', label: 'Timetable' },
  { id: 'list', label: 'List' },
  { id: 'row', label: 'Row' },
] as const

const fleetGroupOpen = shallowRef(true)

const fleetGroupItems = [
  { label: 'Vehicles', icon: 'i-lucide-truck' },
  { label: 'Drivers', icon: 'i-lucide-id-card' },
  { label: 'Records', icon: 'i-lucide-clipboard-list' },
]

const adminGroupItems = [
  { label: 'Users', icon: 'i-lucide-users' },
  { label: 'Settings', icon: 'i-lucide-settings' },
]

// --- Charts -----------------------------------------------------------------
// Stand-in for a fleet admin dashboard: ringgit spend and diesel volumes.
const dieselPricePerLitre = 3.35
const areaStacked = shallowRef(true)

const fuelSpendByMonth = [
  { month: new Date(2025, 0, 1), kuching: 18420, miri: 12980, bintulu: 9340 },
  { month: new Date(2025, 1, 1), kuching: 17150, miri: 13640, bintulu: 8720 },
  { month: new Date(2025, 2, 1), kuching: 19880, miri: 12310, bintulu: 10460 },
  { month: new Date(2025, 3, 1), kuching: 21240, miri: 14020, bintulu: 11180 },
  { month: new Date(2025, 4, 1), kuching: 20110, miri: 15380, bintulu: 10870 },
  { month: new Date(2025, 5, 1), kuching: 22630, miri: 14790, bintulu: 12040 },
  { month: new Date(2025, 6, 1), kuching: 23890, miri: 16210, bintulu: 11620 },
  { month: new Date(2025, 7, 1), kuching: 22470, miri: 15940, bintulu: 12910 },
  { month: new Date(2025, 8, 1), kuching: 24360, miri: 17080, bintulu: 13240 },
  { month: new Date(2025, 9, 1), kuching: 25710, miri: 16630, bintulu: 12780 },
  { month: new Date(2025, 10, 1), kuching: 24080, miri: 18120, bintulu: 13950 },
  { month: new Date(2025, 11, 1), kuching: 26940, miri: 17460, bintulu: 14380 },
]

const depotSeries = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
  { key: 'bintulu', label: 'Bintulu' },
]

const operatingCostByMonth = fuelSpendByMonth.map((row, index) => ({
  month: row.month,
  fuel: row.kuching + row.miri + row.bintulu,
  maintenance: 8400 + index * 620,
  tolls: 3100 + (index % 4) * 480,
  insurance: 5200,
}))

const operatingCostSeries = [
  { key: 'fuel', label: 'Fuel' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'tolls', label: 'Tolls' },
  { key: 'insurance', label: 'Insurance' },
]

const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const fuelLitresByDepot = fuelSpendByMonth.map((row, index) => ({
  month: monthAbbreviations[index],
  kuching: Math.round(row.kuching / dieselPricePerLitre),
  miri: Math.round(row.miri / dieselPricePerLitre),
  bintulu: Math.round(row.bintulu / dieselPricePerLitre),
}))

const workshopCostByVehicle = [
  { vehicle: 'QAA 1234', parts: 4820, labour: 2310, outsourced: 980 },
  { vehicle: 'QAB 5567', parts: 3110, labour: 1740, outsourced: 2260 },
  { vehicle: 'QAC 8891', parts: 6480, labour: 3020, outsourced: 540 },
  { vehicle: 'QSB 2043', parts: 2270, labour: 1490, outsourced: 1310 },
  { vehicle: 'QTM 7712', parts: 5390, labour: 2680, outsourced: 1870 },
  { vehicle: 'QMC 3308', parts: 3940, labour: 2050, outsourced: 760 },
]

const workshopSeries = [
  { key: 'parts', label: 'Parts' },
  { key: 'labour', label: 'Labour' },
  { key: 'outsourced', label: 'Outsourced' },
]

function totalOperatingCost(key: 'fuel' | 'maintenance' | 'tolls' | 'insurance') {
  return operatingCostByMonth.reduce((sum, row) => sum + row[key], 0)
}

const costShareByCategory = [
  { category: 'Fuel', amount: totalOperatingCost('fuel') },
  { category: 'Maintenance', amount: totalOperatingCost('maintenance') },
  { category: 'Tolls', amount: totalOperatingCost('tolls') },
  { category: 'Insurance', amount: totalOperatingCost('insurance') },
]

const ringgitFormat = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
})

function formatRinggit(value: number) {
  return ringgitFormat.format(value)
}

/** Compact money ticks so the y axis stays narrow: RM 24.4k. */
function formatRinggitAxis(value: number) {
  return value >= 1000 ? `RM ${Math.round(value / 100) / 10}k` : `RM ${value}`
}

function formatLitres(value: number) {
  return `${value.toLocaleString('en-MY')} L`
}

function formatLitresAxis(value: number) {
  return value >= 1000 ? `${Math.round(value / 100) / 10}k L` : `${value} L`
}

const totalFleetCost = costShareByCategory.reduce((sum, row) => sum + row.amount, 0)

const timetableDays = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
]

const timetableEvents = [
  { id: 1, day: 'mon', start: '08:00', end: '09:30', title: 'Data Structures', subtitle: 'Room 301' },
  { id: 2, day: 'mon', start: '10:00', end: '11:00', title: 'Calculus II', subtitle: 'Room 102' },
  { id: 3, day: 'mon', start: '14:00', end: '15:30', title: 'Physics Lab', subtitle: 'Lab 3A' },
  { id: 4, day: 'tue', start: '09:00', end: '10:30', title: 'Operating Systems', subtitle: 'Room 405' },
  { id: 5, day: 'tue', start: '11:00', end: '12:00', title: 'Technical Writing', subtitle: 'Room 210' },
  { id: 6, day: 'tue', start: '13:30', end: '15:00', title: 'Database Systems', subtitle: 'Lab 1A' },
  { id: 7, day: 'wed', start: '08:00', end: '09:30', title: 'Data Structures', subtitle: 'Room 301' },
  { id: 8, day: 'wed', start: '10:00', end: '11:00', title: 'Calculus II', subtitle: 'Room 102' },
  { id: 9, day: 'wed', start: '13:00', end: '14:30', title: 'Capstone Project', subtitle: 'Team meeting' },
  { id: 10, day: 'wed', start: '15:00', end: '16:00', title: 'Office Hours', subtitle: 'Prof. Kim' },
  { id: 11, day: 'thu', start: '09:00', end: '10:30', title: 'Operating Systems', subtitle: 'Room 405' },
  { id: 12, day: 'thu', start: '11:00', end: '12:00', title: 'Technical Writing', subtitle: 'Room 210' },
  { id: 13, day: 'thu', start: '14:00', end: '16:00', title: 'Database Lab', subtitle: 'Hands-on PostgreSQL' },
  { id: 14, day: 'fri', start: '08:30', end: '10:00', title: 'Physics Lecture', subtitle: 'Room 108' },
  { id: 15, day: 'fri', start: '10:30', end: '12:00', title: 'Capstone Project', subtitle: 'Sprint review' },
  { id: 16, day: 'fri', start: '13:00', end: '14:00', title: 'Advisor Check-in', subtitle: 'Dr. Patel' },
]

const driverColumns = [
  { key: 'name', label: 'Driver' },
  { key: 'license', label: 'License' },
  { key: 'region', label: 'Region' },
  { key: 'vehicle', label: 'Vehicle' },
]
const selectedDrivers = shallowRef<Array<string | number>>([])
const drivers = [
  {
    id: 'AJ',
    name: 'Alice Johnson',
    license: 'AJ-4821',
    region: 'Berlin',
    vehicle: 'Van',
    vehicles: [
      { plate: 'B-AJ-101', make: 'Mercedes Sprinter', year: 2022, status: 'Active' },
      { plate: 'B-AJ-102', make: 'VW Crafter', year: 2020, status: 'Service' },
    ],
  },
  {
    id: 'BS',
    name: 'Bob Smith',
    license: 'BS-9912',
    region: 'Lisbon',
    vehicle: 'Truck',
    vehicles: [
      { plate: 'LS-BS-201', make: 'Volvo FH', year: 2021, status: 'Active' },
    ],
  },
  {
    id: 'CW',
    name: 'Carol Williams',
    license: 'CW-3344',
    region: 'New York',
    vehicle: 'Sedan',
    vehicles: [
      { plate: 'NY-CW-301', make: 'Toyota Camry', year: 2023, status: 'Active' },
      { plate: 'NY-CW-302', make: 'Ford Fusion', year: 2019, status: 'Service' },
    ],
  },
]

const switcherValue = shallowRef('playground')
const switcherItems = [
  { value: 'playground', label: 'Component playground' },
  { value: 'docs', label: 'Documentation' },
]

const searchQuery = shallowRef('')
const weightKg = shallowRef('')

const treeChecked = shallowRef<string[]>(['item_create'])
const treeGroups = [
  {
    key: 'items',
    label: 'Items',
    children: [
      { value: 'item_create', label: 'Create items' },
      { value: 'item_modify', label: 'Modify items' },
      { value: 'item_delete', label: 'Delete items' },
    ],
  },
  {
    key: 'admin',
    label: 'Administration',
    children: [
      { value: 'user_manage', label: 'Manage users' },
      { value: 'audit_view', label: 'View audit log' },
    ],
  },
]
const treeItems = [{ value: 'report_export', label: 'Export reports' }]

const quarterGroups: GroupedTableGroup[] = [
  {
    key: 'product',
    columns: [{ key: 'product', label: 'Product', class: 'min-w-40', footer: 'Total' }],
  },
  {
    key: 'q1',
    label: 'Q1 2026',
    columns: [
      { key: 'q1_units', label: 'Units', footer: 'sum' },
      { key: 'q1_revenue', label: 'Revenue (RM)', footer: 'sum' },
    ],
  },
  {
    key: 'q2',
    label: 'Q2 2026',
    columns: [
      { key: 'q2_units', label: 'Units', footer: 'sum' },
      { key: 'q2_revenue', label: 'Revenue (RM)', footer: 'sum' },
    ],
  },
]

const quarterRows = [
  { id: 'P-01', product: 'Classic Lamp', q1_units: 320, q1_revenue: 16000, q2_units: 410, q2_revenue: 20500 },
  { id: 'P-02', product: 'Advanced Cabinet', q1_units: 145, q1_revenue: 76125, q2_units: 130, q2_revenue: 68250 },
  { id: 'P-03', product: 'Standard Widget', q1_units: 980, q1_revenue: 7350, q2_units: 1120, q2_revenue: 8400 },
  { id: 'P-04', product: 'Compact Chair', q1_units: 260, q1_revenue: 32500, q2_units: 295, q2_revenue: 36875 },
  { id: 'P-05', product: 'Pro Keyboard', q1_units: 540, q1_revenue: 108000, q2_units: 505, q2_revenue: 101000 },
]

interface StockRow {
  id: string
  sku: string
  product: string
  quantity: number
  price: number
  reorder: number
}

const stockGroups: GroupedTableGroup[] = [
  {
    key: 'stock',
    columns: [
      { key: 'sku', label: 'SKU' },
      { key: 'product', label: 'Product', class: 'min-w-40' },
      { key: 'quantity', label: 'Qty', editable: true },
      { key: 'price', label: 'Unit price (RM)', editable: true },
      { key: 'reorder', label: 'Reorder level', editable: true },
    ],
  },
]

const stockRows = ref<StockRow[]>([
  { id: 'S-01', sku: 'SKU-1001', product: 'Classic Lamp', quantity: 26, price: 50, reorder: 10 },
  { id: 'S-02', sku: 'SKU-1002', product: 'Advanced Cabinet', quantity: 33, price: 525, reorder: 5 },
  { id: 'S-03', sku: 'SKU-1003', product: 'Standard Widget', quantity: 7, price: 7.5, reorder: 20 },
  { id: 'S-04', sku: 'SKU-1004', product: 'Compact Chair', quantity: 21, price: 125, reorder: 8 },
  { id: 'S-05', sku: 'SKU-1005', product: 'Pro Keyboard', quantity: 42, price: 200, reorder: 15 },
])

const quantityValue = shallowRef<number | null>(0)
const temperatureValue = shallowRef<number | null>(null)
const notesText = shallowRef('')
const toggleBold = shallowRef(false)
const toggleItalic = shallowRef(true)
const progressValue = shallowRef(33)
const droppedFiles = shallowRef<File[]>([])
const scrollRows = Array.from({ length: 20 }, (_, i) => `List row ${i + 1}`)
const pickerRangeStart = shallowRef('')
const pickerRangeEnd = shallowRef('')
const payrollMonth = shallowRef('')
const demoPage = shallowRef(1)

const checkoutSteps: StepperStep[] = [
  { title: 'Cart', description: 'Review your items' },
  { title: 'Shipping', description: 'Address and courier', icon: 'i-lucide-truck' },
  { title: 'Payment', description: 'Card or transfer' },
  { title: 'Done', description: 'Order confirmed' },
]
const checkoutStep = shallowRef(1)
const signatureOpen = shallowRef(false)
const signatureUrl = shallowRef('')

function onDropFiles(files: File[]) {
  droppedFiles.value = [...droppedFiles.value, ...files]
}

function removeDroppedFile(index: number) {
  droppedFiles.value = droppedFiles.value.filter((_, i) => i !== index)
}

function onStockSave(edit: GroupedTableSave<StockRow>) {
  Object.assign(edit.row, { [edit.key]: edit.value })
  toast.success({ title: 'Cell saved', description: `${edit.row.product}: ${edit.key} → ${edit.value}` })
}

function onStockSaveAll(edits: GroupedTableRowEdits<StockRow>[]) {
  for (const edit of edits)
    Object.assign(edit.row, edit.changes)
  const count = edits.reduce((sum, edit) => sum + Object.keys(edit.changes).length, 0)
  toast.success({ title: 'All saved', description: `${count} cells across ${edits.length} rows.` })
}

async function onImperativeConfirm() {
  const ok = await confirm({
    title: 'Delete item?',
    description: 'This action cannot be undone.',
    confirmText: 'Delete',
    destructive: true,
  })
  if (ok)
    toast.success({ title: 'Confirmed', description: 'confirm() resolved true.' })
  else
    toast.info({ title: 'Cancelled', description: 'confirm() resolved false.' })
}

function scrollToComponent(id: string, closeMobileSidebar: () => void) {
  activeComponentSection.value = id
  // Scroll the shell's <main> only — scrollIntoView also scrolls the window,
  // which drags the whole app shell up and leaves a blank void below it.
  // Undo any stray window scroll from before (it hides the sidebar header).
  window.scrollTo(0, 0)
  const el = document.getElementById(id)
  const container = el?.closest('main')
  if (el && container) {
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - 16
    container.scrollTo({ top, behavior: 'smooth' })
  }
  closeMobileSidebar()
}
</script>

<template>
  <AppShell content-class="p-4 md:p-8">
    <template #sidebar-header>
      <WorkspaceSwitcher
        v-model="switcherValue"
        title="@yf/ui"
        icon="i-lucide-layers"
        :items="switcherItems"
      />
    </template>

    <template #sidebar="{ closeMobileSidebar }">
      <SidebarGroup label="Components" collapsible>
        <SidebarItem
          v-for="section in componentSections"
          :key="section.id"
          as="button"
          type="button"
          class="w-full"
          :active="activeComponentSection === section.id"
          @click="scrollToComponent(section.id, closeMobileSidebar)"
        >
          {{ section.label }}
        </SidebarItem>
      </SidebarGroup>
    </template>

    <template #sidebar-footer>
      <div class="space-y-4">
        <ThemePalettePicker />
        <p class="text-xs text-muted-foreground">
          {{ componentSections.length }} component groups
        </p>
      </div>
    </template>

    <template #header>
      <h1 class="truncate text-lg font-semibold tracking-tight">Component preview</h1>
    </template>

    <div class="mx-auto max-w-3xl space-y-8">
      <p class="text-sm text-muted-foreground">
        Review shared controls, overlays, navigation, and data display components.
      </p>

        <Card id="buttons" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Buttons</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Add item">+</Button>
          </div>
        </CardContent></Card>

        <Card id="badges" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Badges</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="tertiary">Tertiary</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent></Card>

        <Card id="form-controls" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Form controls</h2>

          <div class="space-y-2">
            <Label for="preview-input">Preview value</Label>
            <Input
              id="preview-input"
              v-model="inputValue"
              placeholder="Type something to preview v-model"
            />
            <p class="text-sm text-muted-foreground">Typed value: {{ inputValue }}</p>
          </div>

          <div class="space-y-2">
            <Label for="amount-input">Amount</Label>
            <InputGroup>
              <InputGroupAddon side="leading">RM</InputGroupAddon>
              <Input
                id="amount-input"
                v-model="amount"
                :class="inputGroupInputClass"
                inputmode="decimal"
                placeholder="0.00"
              />
            </InputGroup>
          </div>

          <div class="space-y-2">
            <Label for="country-select">Country</Label>
            <Select v-model="selectedCountry">
              <SelectTrigger id="country-select">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="malaysia">Malaysia</SelectItem>
                <SelectItem value="singapore">Singapore</SelectItem>
                <SelectItem value="indonesia">Indonesia</SelectItem>
                <SelectItem value="thailand">Thailand</SelectItem>
                <SelectItem value="vietnam">Vietnam</SelectItem>
              </SelectContent>
            </Select>
            <p class="text-sm text-muted-foreground">Selected country: {{ selectedCountry }}</p>
          </div>

          <div class="space-y-2">
            <Label for="city-autocomplete">Malaysian city</Label>
            <Autocomplete
              id="city-autocomplete"
              v-model="selectedCity"
              :options="cityOptions"
              placeholder="Start typing a city"
            />
            <p class="text-sm text-muted-foreground">Selected city: {{ selectedCity }}</p>
          </div>

          <div class="flex items-center gap-2">
            <Checkbox id="notifications" v-model="notificationsEnabled" />
            <Label for="notifications">Enable email notifications</Label>
          </div>

          <div class="flex items-center gap-2">
            <Switch id="auto-save" v-model="autoSaveEnabled" />
            <Label for="auto-save">Enable automatic saving</Label>
          </div>

          <div class="space-y-2">
            <Label for="due-date">Due date</Label>
            <DatePicker
              id="due-date"
              v-model="selectedDate"
              placeholder="Select a due date"
            />
            <p class="text-sm text-muted-foreground">Selected date: {{ selectedDate }}</p>
          </div>

          <div class="space-y-2">
            <Label for="workday">With rest days</Label>
            <DatePicker
              id="workday"
              v-model="selectedWorkday"
              placeholder="Pick a working day"
              :restday="['sat', 'sun']"
              exclude="2026-07-10, 2026-07-20"
              restday-class="text-destructive/60"
              exclude-class="line-through text-warning"
            />
            <p class="text-sm text-muted-foreground">Selected date: {{ selectedWorkday }}</p>
          </div>
        </CardContent></Card>

        <Card id="form-field" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Form field</h2>
          <FormField label="Email" for="ff-email" required hint="We never share this.">
            <Input id="ff-email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Username" for="ff-username" error="Username is already taken.">
            <Input id="ff-username" model-value="admin" />
          </FormField>
        </CardContent></Card>

        <Card id="number-input" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Number input, textarea &amp; toggle</h2>

          <div class="space-y-2">
            <Label for="qty-number">Quantity (no negatives)</Label>
            <NumberInput id="qty-number" v-model="quantityValue" :min="0" :max="999" />
            <p class="text-sm text-muted-foreground">
              Model: {{ quantityValue === null ? 'null (cleared)' : quantityValue }} — the 0 is fully
              clearable, arrows step by 1.
            </p>
          </div>

          <div class="space-y-2">
            <Label for="temp-number">Temperature (allow negative, step 0.5)</Label>
            <NumberInput id="temp-number" v-model="temperatureValue" allow-negative :step="0.5" placeholder="—" />
            <p class="text-sm text-muted-foreground">
              Model: {{ temperatureValue === null ? 'null' : temperatureValue }}
            </p>
          </div>

          <div class="space-y-2">
            <Label for="notes-area">Notes</Label>
            <Textarea id="notes-area" v-model="notesText" rows="3" placeholder="Multi-line text…" />
          </div>

          <div class="space-y-2">
            <Label>Toggle buttons (hold their state)</Label>
            <div class="flex gap-2">
              <ToggleButton v-model="toggleBold" aria-label="Bold">
                <span class="i-lucide-bold h-4 w-4" aria-hidden="true" />
              </ToggleButton>
              <ToggleButton v-model="toggleItalic" variant="inverted" aria-label="Italic">
                <span class="i-lucide-italic h-4 w-4" aria-hidden="true" />
              </ToggleButton>
              <ToggleButton :model-value="false" disabled>Disabled</ToggleButton>
            </div>
            <p class="text-sm text-muted-foreground">Bold: {{ toggleBold }}, italic: {{ toggleItalic }}</p>
          </div>
        </CardContent></Card>

        <Card id="icon-input" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Icon input</h2>

          <div class="space-y-2">
            <Label for="search-input">Search (start icon)</Label>
            <IconInput
              id="search-input"
              v-model="searchQuery"
              start-icon="i-lucide-search"
              placeholder="Search items…"
            />
          </div>

          <div class="space-y-2">
            <Label for="weight-input">Weight (end icon)</Label>
            <IconInput
              id="weight-input"
              v-model="weightKg"
              end-icon="i-lucide-weight"
              inputmode="decimal"
              placeholder="0.0"
            />
          </div>

          <div class="space-y-2">
            <Label for="both-input">Both sides</Label>
            <IconInput
              id="both-input"
              start-icon="i-lucide-mail"
              end-icon="i-lucide-badge-check"
              placeholder="you@example.com"
            />
          </div>
        </CardContent></Card>

        <Card id="checkbox-tree" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Checkbox tree</h2>
          <p class="text-sm text-muted-foreground">
            Tick a group to select everything under it; click the group label to collapse or expand.
          </p>
          <CheckboxTree
            v-model="treeChecked"
            :groups="treeGroups"
            :items="treeItems"
          />
          <p class="text-sm text-muted-foreground">Checked: {{ treeChecked.join(', ') || 'none' }}</p>
        </CardContent></Card>

        <Card id="tabs" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Tabs</h2>

          <div class="space-y-2">
            <Tabs v-model="selectedRange">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <TabsContent value="day">
                <p class="text-sm text-muted-foreground">Showing metrics for the current day.</p>
              </TabsContent>
              <TabsContent value="week">
                <p class="text-sm text-muted-foreground">Showing metrics for the current week.</p>
              </TabsContent>
              <TabsContent value="month">
                <p class="text-sm text-muted-foreground">Showing metrics for the current month.</p>
              </TabsContent>
            </Tabs>
            <p class="text-sm text-muted-foreground">Active range: {{ selectedRange }}</p>
          </div>

          <div class="space-y-2">
            <p class="text-sm font-medium">With a disabled item</p>
            <Tabs model-value="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent></Card>

        <Card id="pickers" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Time picker &amp; wheel picker</h2>

          <div class="space-y-2">
            <Label>12-hour</Label>
            <TimePicker v-model="time12" />
            <p class="text-sm text-muted-foreground">Value: {{ time12 }}</p>
          </div>

          <div class="space-y-2">
            <Label>24-hour, 5-minute steps</Label>
            <TimePicker v-model="time24" format="24" :minute-step="5" />
            <p class="text-sm text-muted-foreground">Value: {{ time24 }}</p>
          </div>

          <div class="space-y-2">
            <Label>Raw wheel picker (single column)</Label>
            <div class="flex items-center gap-3">
              <div class="w-40 rounded-2xl border bg-popover p-2">
                <WheelPicker>
                  <WheelPickerColumn
                    v-model="wheelValue"
                    :options="cityOptions"
                    loop
                    aria-label="City"
                  />
                </WheelPicker>
              </div>
              <p class="text-sm text-muted-foreground">Selected: {{ wheelValue }}</p>
            </div>
          </div>
        </CardContent></Card>

        <Card id="accordion" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Accordion</h2>
          <Accordion type="single" collapsible default-value="item-1" class="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>Yes. It follows the WAI-ARIA design pattern.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>Bootstrap-style bordered container with divided items.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>Yes, it animates open and close by default.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent></Card>

        <Card id="sidebar-groups" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Sidebar groups</h2>
          <p class="text-sm text-muted-foreground">
            <code>SidebarGroup</code> renders a static heading by default. Add
            <code>collapsible</code> to turn the label into a toggle — it keeps its own state
            unless you bind <code>v-model:open</code>.
          </p>

          <div class="flex flex-wrap items-start gap-6">
            <div class="w-56 rounded-lg border border-sidebar-border bg-sidebar py-2 text-sidebar-foreground">
              <SidebarGroup v-model:open="fleetGroupOpen" label="Fleet" collapsible>
                <SidebarItem v-for="item in fleetGroupItems" :key="item.label" as="button" type="button" class="w-full">
                  <template #icon>
                    <span :class="cn(item.icon, 'h-4 w-4')" aria-hidden="true" />
                  </template>
                  {{ item.label }}
                </SidebarItem>
              </SidebarGroup>

              <SidebarGroup label="Admin" collapsible :default-open="false">
                <SidebarItem v-for="item in adminGroupItems" :key="item.label" as="button" type="button" class="w-full">
                  <template #icon>
                    <span :class="cn(item.icon, 'h-4 w-4')" aria-hidden="true" />
                  </template>
                  {{ item.label }}
                </SidebarItem>
              </SidebarGroup>

              <SidebarGroup label="Reports">
                <SidebarItem as="button" type="button" class="w-full">
                  <template #icon>
                    <span class="i-lucide-file-text h-4 w-4" aria-hidden="true" />
                  </template>
                  Monthly summary
                </SidebarItem>
              </SidebarGroup>
            </div>

            <div class="space-y-3 text-sm">
              <div class="flex items-center gap-2">
                <Switch id="fleet-group-open" v-model="fleetGroupOpen" />
                <Label for="fleet-group-open">Fleet group open</Label>
              </div>
              <p class="max-w-xs text-xs text-muted-foreground">
                Fleet is controlled from here, so the switch and the group header stay in sync.
                Admin starts closed and manages itself. Reports has no
                <code>collapsible</code>, so its heading stays static.
              </p>
            </div>
          </div>
        </CardContent></Card>

        <Card id="progress" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Progress &amp; spinner</h2>

          <div class="space-y-2">
            <Progress v-model="progressValue" />
            <div class="flex gap-2">
              <Button size="sm" variant="outline" @click="progressValue = 33">33%</Button>
              <Button size="sm" variant="outline" @click="progressValue = 66">66%</Button>
              <Button size="sm" variant="outline" @click="progressValue = 100">100%</Button>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <Spinner />
            <Spinner class="h-8 w-8 text-primary" />
            <Button disabled>
              <Spinner class="mr-2 h-4 w-4" />
              Saving…
            </Button>
          </div>
        </CardContent></Card>

        <Card id="stepper" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Stepper</h2>

          <div class="space-y-4">
            <Stepper v-model="checkoutStep" :steps="checkoutSteps" clickable />
            <div class="flex gap-2">
              <Button variant="outline" size="sm" :disabled="checkoutStep === 0" @click="checkoutStep -= 1">Back</Button>
              <Button size="sm" :disabled="checkoutStep === checkoutSteps.length - 1" @click="checkoutStep += 1">Next</Button>
            </div>
          </div>

          <div class="space-y-2">
            <Label>Vertical</Label>
            <Stepper v-model="checkoutStep" :steps="checkoutSteps" orientation="vertical" clickable class="max-w-xs" />
          </div>
        </CardContent></Card>

        <Card id="attachment" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Attachment &amp; dropzone</h2>

          <Dropzone
            title="Cloud storage empty"
            description="Upload files to your cloud storage to access them anywhere."
            button-label="Upload files"
            @files="onDropFiles"
          />

          <AttachmentList v-if="droppedFiles.length">
            <Attachment
              v-for="(file, index) in droppedFiles"
              :key="`${file.name}-${index}`"
              :name="file.name"
              :size="file.size"
              @remove="removeDroppedFile(index)"
            />
          </AttachmentList>

          <div class="space-y-2">
            <Label>States</Label>
            <AttachmentList>
              <Attachment name="quarterly-report.pdf" :size="2411724" :progress="45" />
              <Attachment name="holiday-photo.jpg" :size="4085760" error="Upload failed — file too large." />
            </AttachmentList>
          </div>
        </CardContent></Card>

        <Card id="hover-card" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Hover card</h2>
          <p class="text-sm leading-7">
            The
            <HoverCard>
              <HoverCardTrigger>@yf/ui</HoverCardTrigger>
              <HoverCardContent>
                <div class="flex gap-3">
                  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">UI</div>
                  <div class="space-y-1">
                    <h4 class="text-sm font-semibold">@yf/ui</h4>
                    <p class="text-sm text-muted-foreground">
                      Internal Vue 3 component library on radix-vue primitives and UnoCSS theming.
                    </p>
                    <p class="text-xs text-muted-foreground">Updated July 2026</p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            library ships accessible, themeable components — hover the dotted term to preview.
          </p>
        </CardContent></Card>

        <Card id="dropdown-menu" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Dropdown menu</h2>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Row actions:</p>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" size="icon" aria-label="Row actions">
                  <span class="i-lucide-ellipsis h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <span class="i-lucide-pencil h-4 w-4" aria-hidden="true" />
                  Edit
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span class="i-lucide-copy h-4 w-4" aria-hidden="true" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive focus:text-destructive">
                  <span class="i-lucide-trash-2 h-4 w-4" aria-hidden="true" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent></Card>

        <Card id="scroll-area" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Scroll area</h2>
          <p class="text-sm text-muted-foreground">
            Same slim scrollbar on macOS and Windows, instead of each OS doing its own thing.
          </p>
          <ScrollArea class="h-40 rounded-md border" orientation="both">
            <div class="space-y-2 p-3">
              <div v-for="row in scrollRows" :key="row" class="text-sm">{{ row }}</div>
              <div class="whitespace-nowrap text-sm text-muted-foreground">
                This row is intentionally very very very very very very very very very very wide to force a horizontal scrollbar.
              </div>
            </div>
          </ScrollArea>
        </CardContent></Card>

        <Card id="card-sections" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Card with bordered header &amp; footer</h2>
          <Card class="max-w-sm">
            <CardHeader border>
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <CardTitle>Storage</CardTitle>
                  <CardDescription>Usage across your workspace.</CardDescription>
                </div>
                <Badge variant="outline">Pro</Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-4 pt-6">
              <div class="flex items-baseline justify-between">
                <span class="text-2xl font-semibold tracking-tight">64.2 GB</span>
                <span class="text-sm text-muted-foreground">of 100 GB</span>
              </div>
              <Progress :model-value="64" />
              <div class="flex items-center justify-between text-sm">
                <span class="text-muted-foreground">Members</span>
                <span class="font-medium">8 seats</span>
              </div>
            </CardContent>
            <CardFooter border class="justify-between">
              <Button variant="ghost" size="sm">Manage plan</Button>
              <Button size="sm">Upgrade</Button>
            </CardFooter>
          </Card>
        </CardContent></Card>

        <Card id="calendar-range" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Date range picker</h2>
          <div class="max-w-xs space-y-2">
            <Label for="range-picker">Date range</Label>
            <DatePicker
              id="range-picker"
              range
              v-model:start="pickerRangeStart"
              v-model:end="pickerRangeEnd"
              placeholder="Pick a date range"
            />
            <p class="text-sm text-muted-foreground">
              Range: {{ pickerRangeStart || '—' }} → {{ pickerRangeEnd || '—' }}
            </p>
          </div>
        </CardContent></Card>

        <Card id="month-picker" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Month picker</h2>
          <div class="max-w-xs space-y-2">
            <Label>Payroll period</Label>
            <MonthPicker v-model="payrollMonth" />
            <p class="text-sm text-muted-foreground">Selected: {{ payrollMonth || '—' }}</p>
          </div>
        </CardContent></Card>

        <Card id="big-calendar" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <div>
            <h2 class="text-lg font-semibold">Big calendar</h2>
            <p class="text-sm text-muted-foreground">
              Selected date: {{ selectedBigCalendarDate || 'None' }}
            </p>
          </div>
          <BigCalendar v-model="selectedBigCalendarDate" />
        </CardContent></Card>

        <Card id="overlays" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Dialog &amp; Popover</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Dialog>
              <DialogTrigger as-child>
                <Button >Open dialog</Button>
              </DialogTrigger>
              <DialogContent size="lg">
                <DialogHeader>
                  <DialogTitle>Edit preview value</DialogTitle>
                  <DialogDescription>
                    Enter a value to check form controls inside a large dialog.
                  </DialogDescription>
                </DialogHeader>
                <div class="space-y-2">
                  <Label for="dialog-input">Dialog value</Label>
                  <Input
                    id="dialog-input"
                    v-model="dialogValue"
                    placeholder="Type a dialog value"
                  />
                </div>
                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="secondary">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline">Open popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p class="text-sm">
                  Popovers keep short contextual information close to its trigger.
                </p>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent></Card>

        <Card id="feedback" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Toast &amp; Confirmation</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              @click="toast({ title: 'Saved', description: 'Your changes have been saved.', action: { label: 'Undo', onClick: () => toast.info({ title: 'Undone' }) } })"
            >
              Default toast
            </Button>
            <Button
              variant="success"
              @click="toast.success({ title: 'Success', description: 'Record created successfully.' })"
            >
              Success
            </Button>
            <Button
              variant="warning"
              @click="toast.warning({ title: 'Warning', description: 'Quota is almost exhausted.' })"
            >
              Warning
            </Button>
            <Button
              variant="danger"
              @click="toast.error({ title: 'Error', description: 'Failed to save the record.' })"
            >
              Error
            </Button>
            <Button
              variant="ghost"
              @click="toast.info({ title: 'Heads up', description: 'A new version is available.' })"
            >
              Info
            </Button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger as-child>
                <Button variant="outline">Declarative confirm</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the record.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="danger"
                    @click="toast.success({ title: 'Deleted', description: 'The record was deleted.' })"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button variant="danger" @click="onImperativeConfirm">
              Imperative confirm()
            </Button>
          </div>
        </CardContent></Card>

        <Card id="skeleton-empty" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Skeleton &amp; empty state</h2>
          <div class="flex items-center gap-3">
            <Skeleton class="h-10 w-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <Skeleton class="h-4 w-3/5" />
              <Skeleton class="h-4 w-2/5" />
            </div>
          </div>
          <EmptyState
            icon="i-lucide-package"
            title="No items yet"
            description="Create your first item to get started."
          >
            <Button size="sm">New item</Button>
          </EmptyState>
        </CardContent></Card>

        <Card id="timeline" class="scroll-mt-20"><CardContent class="space-y-6 p-6">
          <h2 class="text-lg font-semibold">Timeline</h2>

          <Timeline>
            <TimelineItem time="09:12" title="Order placed" icon="i-lucide-shopping-cart" state="done">
              Payment authorized for RM 249.00.
            </TimelineItem>
            <TimelineItem time="09:40" title="Processing" state="done">
              Warehouse picked and packed your items.
            </TimelineItem>
            <TimelineItem time="14:05" title="Shipped" state="active">
              Handed to courier — tracking #KP883120.
            </TimelineItem>
            <TimelineItem time="Est. Jul 24" title="Out for delivery">
              Arriving between 9am and 6pm.
            </TimelineItem>
          </Timeline>

          <div class="space-y-2">
            <Label>Horizontal</Label>
            <Timeline orientation="horizontal">
              <TimelineItem time="09:12" title="Placed" icon="i-lucide-shopping-cart" state="done" />
              <TimelineItem time="09:40" title="Processing" state="done" />
              <TimelineItem time="14:05" title="Shipped" state="active" />
              <TimelineItem time="Jul 24" title="Delivered" />
            </Timeline>
          </div>
        </CardContent></Card>

        <Card id="signature-pad" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Signature pad</h2>

          <SignaturePad class="max-w-md" />

          <div class="flex items-center gap-3">
            <Button @click="signatureOpen = true">Sign in dialog</Button>
            <img
              v-if="signatureUrl"
              :src="signatureUrl"
              alt="Saved signature"
              class="h-16 rounded-md border bg-background"
            >
          </div>
          <SignatureDialog v-model:open="signatureOpen" @save="url => signatureUrl = url" />
        </CardContent></Card>

        <Card id="charts" class="scroll-mt-20"><CardContent class="space-y-8 p-6">
          <h2 class="text-lg font-semibold">Charts</h2>

          <div class="space-y-2">
            <div>
              <h3 class="text-sm font-medium">Fuel spend by depot</h3>
              <p class="text-xs text-muted-foreground">
                Time series — x values are <code>Date</code> objects, money ticks compacted to
                <code>RM 24.4k</code> while the tooltip shows the full amount.
              </p>
            </div>
            <LineChart
              :data="fuelSpendByMonth"
              x="month"
              :series="depotSeries"
              :height="280"
              y-label="Diesel spend"
              :y-formatter="formatRinggitAxis"
              :tooltip-formatter="formatRinggit"
            />
          </div>

          <div class="space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-sm font-medium">Operating cost breakdown</h3>
                <p class="text-xs text-muted-foreground">
                  Stacked bands by default; flip the switch for overlapping translucent areas.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Switch id="area-stacked" v-model="areaStacked" />
                <Label for="area-stacked" class="text-xs">Stacked</Label>
              </div>
            </div>
            <AreaChart
              :data="operatingCostByMonth"
              x="month"
              :series="operatingCostSeries"
              :stacked="areaStacked"
              :height="280"
              :y-formatter="formatRinggitAxis"
              :tooltip-formatter="formatRinggit"
            />
          </div>

          <div class="space-y-2">
            <div>
              <h3 class="text-sm font-medium">Diesel volume by depot</h3>
              <p class="text-xs text-muted-foreground">
                Grouped bars over categorical months, litres on the y axis.
              </p>
            </div>
            <BarChart
              :data="fuelLitresByDepot"
              x="month"
              :series="depotSeries"
              :height="280"
              :y-formatter="formatLitresAxis"
              :tooltip-formatter="formatLitres"
            />
          </div>

          <div class="space-y-2">
            <div>
              <h3 class="text-sm font-medium">Workshop cost per vehicle</h3>
              <p class="text-xs text-muted-foreground">
                Stacked bars — each bar totals one vehicle's year-to-date repair bill.
              </p>
            </div>
            <BarChart
              :data="workshopCostByVehicle"
              x="vehicle"
              :series="workshopSeries"
              variant="stacked"
              :height="280"
              :y-formatter="formatRinggitAxis"
              :tooltip-formatter="formatRinggit"
            />
          </div>

          <div class="grid gap-6 lg:grid-cols-2">
            <div class="space-y-2">
              <div>
                <h3 class="text-sm font-medium">Cost share by category</h3>
                <p class="text-xs text-muted-foreground">
                  Donut with a central total and values beside the legend labels.
                </p>
              </div>
              <DonutChart
                :data="costShareByCategory"
                value="amount"
                label="category"
                :height="280"
                legend-values
                central-label="Total"
                :central-sub-label="formatRinggit(totalFleetCost)"
                :value-formatter="formatRinggit"
              />
            </div>

            <div class="space-y-2">
              <div>
                <h3 class="text-sm font-medium">Empty data</h3>
                <p class="text-xs text-muted-foreground">
                  Every chart falls back to a placeholder instead of an empty axis frame.
                </p>
              </div>
              <LineChart
                :data="[]"
                x="month"
                :series="depotSeries"
                :height="280"
                empty-message="No fuel records for this period"
              />
            </div>
          </div>
        </CardContent></Card>

        <Card id="table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Table</h2>
          <Table>
            <TableCaption>Recent invoices and their current payment status.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead class="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell class="font-medium">INV-001</TableCell>
                <TableCell><Badge variant="success">Paid</Badge></TableCell>
                <TableCell class="text-right">RM 250.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV-002</TableCell>
                <TableCell><Badge variant="warning">Pending</Badge></TableCell>
                <TableCell class="text-right">RM 150.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV-003</TableCell>
                <TableCell><Badge variant="danger">Overdue</Badge></TableCell>
                <TableCell class="text-right">RM 350.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell class="font-medium">INV-004</TableCell>
                <TableCell><Badge variant="outline">Draft</Badge></TableCell>
                <TableCell class="text-right">RM 450.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent></Card>

        <Card id="data-table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Data table</h2>
          <DataTable
            :columns="driverColumns"
            :rows="drivers"
            row-key="id"
          />
        </CardContent></Card>

        <Card id="grouped-table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Grouped table</h2>
          <p class="text-sm text-muted-foreground">
            Columns organised under banded group headers; a group without a label spans both header rows.
          </p>
          <GroupedTable
            :groups="quarterGroups"
            :rows="quarterRows"
            row-key="id"
          />
        </CardContent></Card>

        <Card id="editable-table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Editable table</h2>
          <p class="text-sm text-muted-foreground">
            Toggle Edit to turn every editable column into inputs, or double-click a single cell
            (or use its hover pen). Dirty cells get per-cell save/discard buttons, and a Save all
            button appears below the table while edits are pending.
          </p>
          <GroupedTable
            :groups="stockGroups"
            :rows="stockRows"
            row-key="id"
            @save="onStockSave"
            @save-all="onStockSaveAll"
          />
        </CardContent></Card>

        <Card id="expandable-table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Expandable table</h2>
          <Expandable
            :columns="driverColumns"
            :rows="drivers"
            row-key="id"
          >
            <template #expanded="{ row }">
              <div class="space-y-2">
                <p class="text-sm font-medium text-muted-foreground">
                  Vehicles for {{ row.name }}
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plate</TableHead>
                      <TableHead>Make</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow v-for="v in row.vehicles" :key="v.plate">
                      <TableCell class="font-medium">{{ v.plate }}</TableCell>
                      <TableCell>{{ v.make }}</TableCell>
                      <TableCell>{{ v.year }}</TableCell>
                      <TableCell>
                        <Badge :variant="v.status === 'Active' ? 'success' : 'warning'">
                          {{ v.status }}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </template>
          </Expandable>
        </CardContent></Card>

        <Card id="check-table" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Check table</h2>
          <CheckTable
            v-model:selected="selectedDrivers"
            :columns="driverColumns"
            :rows="drivers"
            row-key="id"
          />
          <p class="text-sm text-muted-foreground">
            Selected: {{ selectedDrivers.length }} of {{ drivers.length }}
          </p>
        </CardContent></Card>

        <Card id="pagination" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Pagination &amp; footer bar</h2>
          <div class="overflow-hidden rounded-lg border">
            <DataTable :columns="driverColumns" :rows="drivers" row-key="id" />
            <TableFooterBar :total="48" :selected="2">
              <Pagination v-model="demoPage" :total="48" :page-size="10" />
            </TableFooterBar>
          </div>
          <p class="text-sm text-muted-foreground">Page: {{ demoPage }}</p>
        </CardContent></Card>

        <Card id="timetable" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">Timetable</h2>
            <div class="flex gap-2">
              <Button
                size="sm"
                :variant="timetableOrientation === 'vertical' ? 'default' : 'outline'"
                @click="timetableOrientation = 'vertical'"
              >
                Vertical
              </Button>
              <Button
                size="sm"
                :variant="timetableOrientation === 'horizontal' ? 'default' : 'outline'"
                @click="timetableOrientation = 'horizontal'"
              >
                Horizontal
              </Button>
            </div>
          </div>
          <Timetable
            :days="timetableDays"
            :events="timetableEvents"
            :orientation="timetableOrientation"
          />
        </CardContent></Card>

        <Card id="list" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">List</h2>
          <List>
            <ListItem clickable>
              <template #leading>
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm" aria-hidden="true">P</span>
              </template>
              <div>
                <p class="font-medium">Profile details</p>
                <p class="text-sm text-muted-foreground">Update your personal information.</p>
              </div>
            </ListItem>
            <ListItem clickable>
              <template #leading>
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm" aria-hidden="true">N</span>
              </template>
              <div>
                <p class="font-medium">Notifications</p>
                <p class="text-sm text-muted-foreground">Choose which alerts you receive.</p>
              </div>
              <template #trailing>
                <Badge variant="success">Enabled</Badge>
              </template>
            </ListItem>
            <ListItem clickable>
              <template #leading>
                <span class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm" aria-hidden="true">S</span>
              </template>
              <div>
                <p class="font-medium">Security</p>
                <p class="text-sm text-muted-foreground">Manage passwords and active sessions.</p>
              </div>
            </ListItem>
          </List>
        </CardContent></Card>

        <Card id="row" class="scroll-mt-20"><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Row</h2>
          <p class="text-sm text-muted-foreground">
            The fixed-width sidebar matches the main column's height and scrolls internally.
          </p>
          <Row>
            <RowItem main>
              <Card><CardContent class="space-y-3 p-4">
                <h3 class="font-medium">Main content</h3>
                <p class="text-sm text-muted-foreground">
                  This column defines the row height. Its natural height flows to the sibling.
                </p>
                <p v-for="line in 6" :key="line" class="text-sm text-muted-foreground">
                  Paragraph {{ line }} of the main column content.
                </p>
              </CardContent></Card>
            </RowItem>
            <RowItem width="240px">
              <Card><CardContent class="p-4">
                <h3 class="mb-2 font-medium">Activity</h3>
                <List>
                  <ListItem v-for="item in 12" :key="item">
                    <div>
                      <p class="text-sm font-medium">Event {{ item }}</p>
                      <p class="text-xs text-muted-foreground">Updated just now</p>
                    </div>
                  </ListItem>
                </List>
              </CardContent></Card>
            </RowItem>
          </Row>
        </CardContent></Card>
    </div>
    <Toaster />
    <ConfirmDialog />
  </AppShell>
</template>
