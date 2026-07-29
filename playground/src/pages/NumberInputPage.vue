<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Attachment, AttachmentList, Dropzone } from '@/components/ui/attachment'
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
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Stepper } from '@/components/ui/stepper'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { SignatureDialog, SignaturePad } from '@/components/ui/signature-pad'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { ToggleButton } from '@/components/ui/toggle-button'
import { Checkbox } from '@/components/ui/checkbox'
import { CheckboxTree } from '@/components/ui/checkbox-tree'
import { CodeBlock } from '@/components/ui/code-block'
import { DatePicker } from '@/components/ui/date-picker'
import { GroupedTable } from '@/components/ui/grouped-table'
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
import { SidebarGroup, SidebarItem, SidebarSub, SidebarSubItem } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TimePicker } from '@/components/ui/time-picker'
import { Timetable } from '@/components/ui/timetable'
import { ThemePalette } from '@/components/ui/theme-palette'
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
import { toast } from '@/components/ui/toast'
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
} from '@/components/ui/alert-dialog'
import { DataTable } from '@/components/ui/data-table'
import { Expandable } from '@/components/ui/expandable-table'
import { CheckTable } from '@/components/ui/check-table'
import { cn } from '@/lib/utils'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'
import * as demo from '../demo-state'

const usage = usageExamples['number-input']

const {
  totalOperatingCost,
  formatRinggit,
  formatRinggitAxis,
  formatLitres,
  formatLitresAxis,
  onDropFiles,
  removeDroppedFile,
  onStockSave,
  onStockSaveAll,
  onImperativeConfirm,
  inputValue,
  dialogValue,
  amount,
  notificationsEnabled,
  autoSaveEnabled,
  selectedDate,
  selectedWorkday,
  selectedBigCalendarDate,
  selectedCountry,
  selectedCity,
  cityOptions,
  selectedRange,
  time12,
  time24,
  wheelValue,
  timetableOrientation,
  dialogSizes,
  codeBlockSample,
  fleetGroupOpen,
  fleetGroupItems,
  vehicleSubItems,
  adminGroupItems,
  dieselPricePerLitre,
  areaStacked,
  fuelSpendByMonth,
  depotSeries,
  operatingCostByMonth,
  operatingCostSeries,
  monthAbbreviations,
  fuelLitresByDepot,
  workshopCostByVehicle,
  workshopSeries,
  costShareByCategory,
  ringgitFormat,
  totalFleetCost,
  timetableDays,
  timetableEvents,
  driverColumns,
  selectedDrivers,
  drivers,
  searchQuery,
  weightKg,
  treeChecked,
  treeGroups,
  treeItems,
  quarterGroups,
  quarterRows,
  stockGroups,
  stockRows,
  quantityValue,
  temperatureValue,
  notesText,
  toggleBold,
  toggleItalic,
  progressValue,
  droppedFiles,
  scrollRows,
  pickerRangeStart,
  pickerRangeEnd,
  payrollMonth,
  demoPage,
  checkoutSteps,
  checkoutStep,
  signatureOpen,
  signatureUrl,
} = demo

</script>

<template>
  <div class="space-y-8">
  <Card>
<CardContent class="space-y-6 p-6">
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
        </CardContent>
  </Card>
    <UsageExample :example="usage" />
  </div>
</template>
