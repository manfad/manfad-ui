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

const usage = usageExamples['theme-switcher']

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
          <h2 class="text-lg font-semibold">ThemeSwitcher</h2>
          <p class="text-sm text-muted-foreground">
            <code class="text-xs">ThemeSwitcher</code> is exported from
            <code class="text-xs">@manfad/ui</code> and drops into any app without being rewritten.
            The sidebar mounts the same component; this demo shares its state so both stay in sync.
          </p>

          <div class="w-64 rounded-lg border border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
            <ThemeSwitcher />
          </div>

          <div class="space-y-1.5 border-t border-border pt-4 text-sm text-muted-foreground">
            <p>
              It writes <code class="text-xs">data-manfad-component-theme</code> and
              <code class="text-xs">data-manfad-background-theme</code> onto
              <code class="text-xs">&lt;html&gt;</code>, so every component follows without
              being told to.
            </p>
            <p>
              The selection persists to local storage under the
              <code class="text-xs">storageKey</code> prop, default
              <code class="text-xs">manfad-ui-theme</code>. Instances that share a key also share
              live state, so the sidebar and this page highlight the same swatches.
            </p>
          </div>
        </CardContent>
  </Card>
    <UsageExample :example="usage" />
  </div>
</template>
