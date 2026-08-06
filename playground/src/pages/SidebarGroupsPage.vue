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
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
  DropdownTrigger,
} from '@/components/ui/dropdown'
import { Empty } from '@/components/ui/empty'
import { FormField } from '@/components/ui/form-field'
import { Hover, HoverContent, HoverTrigger } from '@/components/ui/hover'
import { MonthPicker } from '@/components/ui/month-picker'
import { NumberInput } from '@/components/ui/number-input'
import { ProgressBar } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Stepper } from '@/components/ui/stepper'
import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { SignatureDialog, SignaturePad } from '@/components/ui/signature-pad'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
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
import { ThemeSwitcher } from '@/components/ui/theme-switcher'
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

const usage = usageExamples['sidebar-groups']

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
<CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Sidebar groups</h2>
          <p class="text-sm text-muted-foreground">
            <code>SidebarGroup</code> renders a static heading by default. Add
            <code>collapsible</code> to turn the label into a toggle — it keeps its own state
            unless you bind <code>v-model:open</code>. <code>SidebarSub</code> nests
            <code>SidebarSubItem</code>s under an expandable item, like Vehicles below.
          </p>

          <div class="flex flex-wrap items-start gap-6">
            <div class="w-56 rounded-lg border border-sidebar-border bg-sidebar py-2 text-sidebar-foreground">
              <SidebarGroup v-model:open="fleetGroupOpen" label="Fleet" collapsible>
                <SidebarSub label="Vehicles" default-open>
                  <template #icon>
                    <span class="i-lucide-truck h-4 w-4" aria-hidden="true" />
                  </template>
                  <SidebarSubItem
                    v-for="(sub, index) in vehicleSubItems"
                    :key="sub"
                    as="button"
                    type="button"
                    class="w-full"
                    :active="index === 0"
                  >
                    {{ sub }}
                  </SidebarSubItem>
                </SidebarSub>
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
        </CardContent>
  </Card>
    <UsageExample :example="usage" />
  </div>
</template>
