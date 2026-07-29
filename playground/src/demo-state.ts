import { ref, shallowRef } from 'vue'
import { type StepperStep } from '@/components/ui/stepper'
import {
  type GroupedTableGroup,
  type GroupedTableRowEdits,
  type GroupedTableSave,
} from '@/components/ui/grouped-table'
import { type TimetableOrientation } from '@/components/ui/timetable'
import { toast } from '@/components/ui/toast'
import { confirm } from '@/components/ui/alert-dialog'

export const inputValue = shallowRef('')
export const dialogValue = shallowRef('')
export const amount = shallowRef('')
export const notificationsEnabled = shallowRef(false)
export const autoSaveEnabled = shallowRef(true)
export const selectedDate = shallowRef('')
export const selectedWorkday = shallowRef('')
export const selectedBigCalendarDate = shallowRef('')
export const selectedCountry = shallowRef('')
export const selectedCity = shallowRef('')
export const cityOptions = ['Kuching', 'Kota Kinabalu', 'Kuala Lumpur', 'Penang', 'Ipoh', 'Johor Bahru']
export const selectedRange = shallowRef('week')
export const time12 = shallowRef('14:30')
export const time24 = shallowRef('09:15')
export const wheelValue = shallowRef('Kuching')
export const timetableOrientation = shallowRef<TimetableOrientation>('vertical')


export const dialogSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const




export const codeBlockSample = `// Theme tokens follow the active palette
const primary = 'hsl(var(--primary))'
const rival = 'hsl(var(--rival))' // opposing accent

export function applyTheme(root: HTMLElement) {
  root.dataset.manfadComponentTheme = 'blue'
}
`



export const fleetGroupOpen = shallowRef(true)

export const fleetGroupItems = [
  { label: 'Drivers', icon: 'i-lucide-id-card' },
  { label: 'Records', icon: 'i-lucide-clipboard-list' },
]

export const vehicleSubItems = ['All vehicles', 'Maintenance', 'Inspections']

export const adminGroupItems = [
  { label: 'Users', icon: 'i-lucide-users' },
  { label: 'Settings', icon: 'i-lucide-settings' },
]

// --- Charts -----------------------------------------------------------------
// Stand-in for a fleet admin dashboard: ringgit spend and diesel volumes.
export const dieselPricePerLitre = 3.35
export const areaStacked = shallowRef(true)

export const fuelSpendByMonth = [
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

export const depotSeries = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
  { key: 'bintulu', label: 'Bintulu' },
]

export const operatingCostByMonth = fuelSpendByMonth.map((row, index) => ({
  month: row.month,
  fuel: row.kuching + row.miri + row.bintulu,
  maintenance: 8400 + index * 620,
  tolls: 3100 + (index % 4) * 480,
  insurance: 5200,
}))

export const operatingCostSeries = [
  { key: 'fuel', label: 'Fuel' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'tolls', label: 'Tolls' },
  { key: 'insurance', label: 'Insurance' },
]

export const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const fuelLitresByDepot = fuelSpendByMonth.map((row, index) => ({
  month: monthAbbreviations[index],
  kuching: Math.round(row.kuching / dieselPricePerLitre),
  miri: Math.round(row.miri / dieselPricePerLitre),
  bintulu: Math.round(row.bintulu / dieselPricePerLitre),
}))

export const workshopCostByVehicle = [
  { vehicle: 'QAA 1234', parts: 4820, labour: 2310, outsourced: 980 },
  { vehicle: 'QAB 5567', parts: 3110, labour: 1740, outsourced: 2260 },
  { vehicle: 'QAC 8891', parts: 6480, labour: 3020, outsourced: 540 },
  { vehicle: 'QSB 2043', parts: 2270, labour: 1490, outsourced: 1310 },
  { vehicle: 'QTM 7712', parts: 5390, labour: 2680, outsourced: 1870 },
  { vehicle: 'QMC 3308', parts: 3940, labour: 2050, outsourced: 760 },
]

export const workshopSeries = [
  { key: 'parts', label: 'Parts' },
  { key: 'labour', label: 'Labour' },
  { key: 'outsourced', label: 'Outsourced' },
]

export function totalOperatingCost(key: 'fuel' | 'maintenance' | 'tolls' | 'insurance') {
  return operatingCostByMonth.reduce((sum, row) => sum + row[key], 0)
}

export const costShareByCategory = [
  { category: 'Fuel', amount: totalOperatingCost('fuel') },
  { category: 'Maintenance', amount: totalOperatingCost('maintenance') },
  { category: 'Tolls', amount: totalOperatingCost('tolls') },
  { category: 'Insurance', amount: totalOperatingCost('insurance') },
]

export const ringgitFormat = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
})

export function formatRinggit(value: number) {
  return ringgitFormat.format(value)
}

/** Compact money ticks so the y axis stays narrow: RM 24.4k. */
export function formatRinggitAxis(value: number) {
  return value >= 1000 ? `RM ${Math.round(value / 100) / 10}k` : `RM ${value}`
}

export function formatLitres(value: number) {
  return `${value.toLocaleString('en-MY')} L`
}

export function formatLitresAxis(value: number) {
  return value >= 1000 ? `${Math.round(value / 100) / 10}k L` : `${value} L`
}

export const totalFleetCost = costShareByCategory.reduce((sum, row) => sum + row.amount, 0)

export const timetableDays = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thu' },
  { id: 'fri', label: 'Fri' },
]

export const timetableEvents = [
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

export const driverColumns = [
  { key: 'name', label: 'Driver' },
  { key: 'license', label: 'License' },
  { key: 'region', label: 'Region' },
  { key: 'vehicle', label: 'Vehicle' },
]
export const selectedDrivers = shallowRef<Array<string | number>>([])
export const drivers = [
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


export const searchQuery = shallowRef('')
export const weightKg = shallowRef('')

export const treeChecked = shallowRef<string[]>(['item_create'])
export const treeGroups = [
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
export const treeItems = [{ value: 'report_export', label: 'Export reports' }]

export const quarterGroups: GroupedTableGroup[] = [
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

export const quarterRows = [
  { id: 'P-01', product: 'Classic Lamp', q1_units: 320, q1_revenue: 16000, q2_units: 410, q2_revenue: 20500 },
  { id: 'P-02', product: 'Advanced Cabinet', q1_units: 145, q1_revenue: 76125, q2_units: 130, q2_revenue: 68250 },
  { id: 'P-03', product: 'Standard Widget', q1_units: 980, q1_revenue: 7350, q2_units: 1120, q2_revenue: 8400 },
  { id: 'P-04', product: 'Compact Chair', q1_units: 260, q1_revenue: 32500, q2_units: 295, q2_revenue: 36875 },
  { id: 'P-05', product: 'Pro Keyboard', q1_units: 540, q1_revenue: 108000, q2_units: 505, q2_revenue: 101000 },
]

export interface StockRow {
  id: string
  sku: string
  product: string
  quantity: number
  price: number
  reorder: number
}

export const stockGroups: GroupedTableGroup[] = [
  {
    key: 'stock',
    columns: [
      { key: 'sku', label: 'SKU', class: 'w-28' },
      { key: 'product', label: 'Product', class: 'w-44' },
      { key: 'quantity', label: 'Qty', editable: true, class: 'w-24' },
      { key: 'price', label: 'Unit price (RM)', editable: true, class: 'w-36' },
      { key: 'reorder', label: 'Reorder level', editable: true, class: 'w-32' },
    ],
  },
]

export const stockRows = ref<StockRow[]>([
  { id: 'S-01', sku: 'SKU-1001', product: 'Classic Lamp', quantity: 26, price: 50, reorder: 10 },
  { id: 'S-02', sku: 'SKU-1002', product: 'Advanced Cabinet', quantity: 33, price: 525, reorder: 5 },
  { id: 'S-03', sku: 'SKU-1003', product: 'Standard Widget', quantity: 7, price: 7.5, reorder: 20 },
  { id: 'S-04', sku: 'SKU-1004', product: 'Compact Chair', quantity: 21, price: 125, reorder: 8 },
  { id: 'S-05', sku: 'SKU-1005', product: 'Pro Keyboard', quantity: 42, price: 200, reorder: 15 },
])

export const quantityValue = shallowRef<number | null>(0)
export const temperatureValue = shallowRef<number | null>(null)
export const notesText = shallowRef('')
export const toggleBold = shallowRef(false)
export const toggleItalic = shallowRef(true)
export const progressValue = shallowRef(33)
export const droppedFiles = shallowRef<File[]>([])
export const scrollRows = Array.from({ length: 20 }, (_, i) => `List row ${i + 1}`)
export const pickerRangeStart = shallowRef('')
export const pickerRangeEnd = shallowRef('')
export const payrollMonth = shallowRef('')
export const demoPage = shallowRef(1)

export const checkoutSteps: StepperStep[] = [
  { title: 'Cart', description: 'Review your items' },
  { title: 'Shipping', description: 'Address and courier', icon: 'i-lucide-truck' },
  { title: 'Payment', description: 'Card or transfer' },
  { title: 'Done', description: 'Order confirmed' },
]
export const checkoutStep = shallowRef(1)
export const signatureOpen = shallowRef(false)
export const signatureUrl = shallowRef('')

export function onDropFiles(files: File[]) {
  droppedFiles.value = [...droppedFiles.value, ...files]
}

export function removeDroppedFile(index: number) {
  droppedFiles.value = droppedFiles.value.filter((_, i) => i !== index)
}

export function onStockSave(edit: GroupedTableSave<StockRow>) {
  Object.assign(edit.row, { [edit.key]: edit.value })
  toast.success({ title: 'Cell saved', description: `${edit.row.product}: ${edit.key} → ${edit.value}` })
}

export function onStockSaveAll(edits: GroupedTableRowEdits<StockRow>[]) {
  for (const edit of edits)
    Object.assign(edit.row, edit.changes)
  const count = edits.reduce((sum, edit) => sum + Object.keys(edit.changes).length, 0)
  toast.success({ title: 'All saved', description: `${count} cells across ${edits.length} rows.` })
}

export async function onImperativeConfirm() {
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

