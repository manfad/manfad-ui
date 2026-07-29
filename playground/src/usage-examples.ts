import type { ComponentSectionId } from './sections'

export interface UsageExample {
  content: string
}

function vue(content: string): UsageExample {
  return { content: content.trim() }
}

export const usageExamples: Record<ComponentSectionId, UsageExample> = {
  buttons: vue(`
<script setup lang="ts">
import { Button } from '@manfad/ui'
</script>

<template>
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline" size="sm">Small</Button>
</template>
`),

  badges: vue(`
<script setup lang="ts">
import { Badge } from '@manfad/ui'
</script>

<template>
  <Badge>Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
</template>
`),

  'badge-summary': vue(`
<script setup lang="ts">
import { BadgeSummary } from '@manfad/ui'

const groups = [{
  key: 'items',
  label: 'Items',
  children: [
    { value: 'item_create', label: 'Create items' },
    { value: 'item_modify', label: 'Modify items' },
    { value: 'item_delete', label: 'Delete items' },
  ],
}]

const values = ['item_create', 'item_modify', 'item_delete']
</script>

<template>
  <BadgeSummary :groups="groups" :values="values" />
</template>
`),

  'theme-palette': vue(`
<script setup lang="ts">
import { ThemePalette } from '@manfad/ui'
</script>

<template>
  <ThemePalette />
  <ThemePalette :tokens="['primary', 'rival', 'muted']" />
</template>
`),

  'theme-switcher': vue(`
<script setup lang="ts">
import { ThemePalettePicker } from '@manfad/ui'
</script>

<template>
  <ThemePalettePicker />
  <!-- Optional custom storage key -->
  <ThemePalettePicker storage-key="manfad-ui-theme-demo" />
</template>
`),

  'form-controls': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  Autocomplete,
  Checkbox,
  DatePicker,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@manfad/ui'

const value = shallowRef('')
const city = shallowRef('')
const checked = shallowRef(false)
const cities = ['Kuching', 'Miri', 'Bintulu']
</script>

<template>
  <Label for="name">Name</Label>
  <Input id="name" v-model="value" placeholder="Type here" />

  <Autocomplete
    v-model="city"
    :options="cities"
    placeholder="Start typing a city"
  />

  <Checkbox v-model="checked" />
  <Switch v-model="checked" />

  <Select v-model="value">
    <SelectTrigger><SelectValue placeholder="Pick one" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="a">Option A</SelectItem>
    </SelectContent>
  </Select>

  <DatePicker v-model="value" />
</template>
`),

  'form-field': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { FormField, Input } from '@manfad/ui'

const email = shallowRef('')
</script>

<template>
  <FormField label="Email" description="We never share this.">
    <Input v-model="email" type="email" placeholder="you@example.com" />
  </FormField>
</template>
`),

  'number-input': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { NumberInput, Textarea, ToggleButton } from '@manfad/ui'

const qty = shallowRef<number | null>(0)
const notes = shallowRef('')
const bold = shallowRef(false)
</script>

<template>
  <NumberInput v-model="qty" :min="0" />
  <Textarea v-model="notes" placeholder="Notes" />
  <ToggleButton v-model="bold">Bold</ToggleButton>
</template>
`),

  'icon-input': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { IconInput } from '@manfad/ui'

const query = shallowRef('')
</script>

<template>
  <IconInput
    v-model="query"
    icon="i-lucide-search"
    placeholder="Search…"
  />
</template>
`),

  'checkbox-tree': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { CheckboxTree } from '@manfad/ui'

const checked = shallowRef<string[]>(['item_create'])
const groups = [{
  key: 'items',
  label: 'Items',
  children: [
    { value: 'item_create', label: 'Create items' },
    { value: 'item_modify', label: 'Modify items' },
  ],
}]
</script>

<template>
  <CheckboxTree v-model="checked" :groups="groups" />
</template>
`),

  'code-block': vue(`
<script setup lang="ts">
import { CodeBlock } from '@manfad/ui'

const content = \`// Apply the active palette
root.dataset.manfadComponentTheme = 'blue'
\`
</script>

<template>
  <CodeBlock :content="content" />
</template>
`),

  tabs: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@manfad/ui'

const tab = shallowRef('week')
</script>

<template>
  <Tabs v-model="tab">
    <TabsList>
      <TabsTrigger value="day">Day</TabsTrigger>
      <TabsTrigger value="week">Week</TabsTrigger>
    </TabsList>
    <TabsContent value="day">Day metrics</TabsContent>
    <TabsContent value="week">Week metrics</TabsContent>
  </Tabs>
</template>
`),

  pickers: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { TimePicker, WheelPicker, WheelPickerColumn } from '@manfad/ui'

const time = shallowRef('14:30')
const city = shallowRef('Kuching')
</script>

<template>
  <TimePicker v-model="time" />
  <WheelPicker v-model="city">
    <WheelPickerColumn :options="['Kuching', 'Miri', 'Bintulu']" />
  </WheelPicker>
</template>
`),

  accordion: vue(`
<script setup lang="ts">
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@manfad/ui'
</script>

<template>
  <Accordion type="single" collapsible>
    <AccordionItem value="one">
      <AccordionTrigger>Section one</AccordionTrigger>
      <AccordionContent>Details go here.</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
`),

  'sidebar-groups': vue(`
<script setup lang="ts">
import { SidebarGroup, SidebarItem, SidebarSub, SidebarSubItem } from '@manfad/ui'
</script>

<template>
  <SidebarGroup label="Fleet" collapsible>
    <SidebarItem>Drivers</SidebarItem>
    <SidebarSub label="Vehicles">
      <SidebarSubItem>All vehicles</SidebarSubItem>
      <SidebarSubItem>Maintenance</SidebarSubItem>
    </SidebarSub>
  </SidebarGroup>
</template>
`),

  progress: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Progress, Spinner } from '@manfad/ui'

const value = shallowRef(33)
</script>

<template>
  <Progress :model-value="value" />
  <Spinner />
</template>
`),

  stepper: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Stepper, type StepperStep } from '@manfad/ui'

const step = shallowRef(1)
const steps: StepperStep[] = [
  { title: 'Cart', description: 'Review items' },
  { title: 'Shipping', description: 'Address' },
  { title: 'Payment', description: 'Card' },
]
</script>

<template>
  <Stepper v-model="step" :steps="steps" />
</template>
`),

  attachment: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Attachment, AttachmentList, Dropzone } from '@manfad/ui'

const files = shallowRef<File[]>([])
</script>

<template>
  <Dropzone @files="files = [...files, ...$event]" />
  <AttachmentList>
    <Attachment
      v-for="(file, i) in files"
      :key="i"
      :name="file.name"
      :size="file.size"
      @remove="files.splice(i, 1)"
    />
  </AttachmentList>
</template>
`),

  'hover-card': vue(`
<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@manfad/ui'
</script>

<template>
  <HoverCard>
    <HoverCardTrigger>@manfad/ui</HoverCardTrigger>
    <HoverCardContent>
      Shared Vue 3 admin UI kit.
    </HoverCardContent>
  </HoverCard>
</template>
`),

  'dropdown-menu': vue(`
<script setup lang="ts">
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@manfad/ui'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">Actions</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuItem>Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
`),

  'scroll-area': vue(`
<script setup lang="ts">
import { ScrollArea } from '@manfad/ui'
</script>

<template>
  <ScrollArea class="h-40 rounded-md border" orientation="both">
    <div class="p-3">Long content…</div>
  </ScrollArea>
</template>
`),

  'card-sections': vue(`
<script setup lang="ts">
import { Badge, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@manfad/ui'
</script>

<template>
  <Card>
    <CardHeader border>
      <CardTitle>Storage</CardTitle>
      <CardDescription>Usage across your workspace.</CardDescription>
      <Badge variant="outline">Pro</Badge>
    </CardHeader>
    <CardContent>Body</CardContent>
    <CardFooter border>Footer</CardFooter>
  </Card>
</template>
`),

  'calendar-range': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { DatePicker } from '@manfad/ui'

const start = shallowRef('')
const end = shallowRef('')
</script>

<template>
  <DatePicker range v-model:start="start" v-model:end="end" />
</template>
`),

  'month-picker': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { MonthPicker } from '@manfad/ui'

const month = shallowRef('')
</script>

<template>
  <MonthPicker v-model="month" />
</template>
`),

  'big-calendar': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { BigCalendar } from '@manfad/ui'

const date = shallowRef('')
</script>

<template>
  <BigCalendar v-model="date" />
</template>
`),

  overlays: vue(`
<script setup lang="ts">
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Popover, PopoverContent, PopoverTrigger } from '@manfad/ui'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button>Open dialog</Button>
    </DialogTrigger>
    <DialogContent size="lg">
      <DialogHeader>
        <DialogTitle>Edit value</DialogTitle>
        <DialogDescription>Update the preview value.</DialogDescription>
      </DialogHeader>
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
    <PopoverContent>Popover body</PopoverContent>
  </Popover>
</template>
`),

  feedback: vue(`
<script setup lang="ts">
import { Button, confirm, toast, Toaster, ConfirmDialog } from '@manfad/ui'

async function onDelete() {
  const ok = await confirm({
    title: 'Delete item?',
    description: 'This cannot be undone.',
    destructive: true,
  })
  if (ok)
    toast.success({ title: 'Deleted' })
}
</script>

<template>
  <Button @click="toast.info({ title: 'Saved' })">Toast</Button>
  <Button variant="danger" @click="onDelete">Confirm</Button>
  <Toaster />
  <ConfirmDialog />
</template>
`),

  'skeleton-empty': vue(`
<script setup lang="ts">
import { Button, EmptyState, Skeleton } from '@manfad/ui'
</script>

<template>
  <Skeleton class="h-8 w-48" />
  <EmptyState title="No items yet" description="Create your first item to get started.">
    <Button>Create item</Button>
  </EmptyState>
</template>
`),

  timeline: vue(`
<script setup lang="ts">
import { Timeline, TimelineItem } from '@manfad/ui'
</script>

<template>
  <Timeline>
    <TimelineItem time="09:12" title="Order placed" state="done" />
    <TimelineItem time="14:05" title="Shipped" state="active" />
    <TimelineItem time="Jul 24" title="Delivered" />
  </Timeline>
</template>
`),

  'signature-pad': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button, SignatureDialog, SignaturePad } from '@manfad/ui'

const open = shallowRef(false)
const url = shallowRef('')
</script>

<template>
  <SignaturePad class="max-w-md" />
  <Button @click="open = true">Sign in dialog</Button>
  <SignatureDialog v-model:open="open" @save="url = $event" />
  <img v-if="url" :src="url" alt="Signature" />
</template>
`),

  charts: vue(`
<script setup lang="ts">
import { LineChart, AreaChart, BarChart, DonutChart } from '@manfad/ui'

const data = [
  { month: new Date(2025, 0, 1), kuching: 18420, miri: 12980 },
]
const series = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
]
</script>

<template>
  <LineChart :data="data" x="month" :series="series" />
  <AreaChart :data="data" x="month" :series="series" stacked />
  <BarChart :data="data" x="month" :series="series" />
  <DonutChart :data="[{ category: 'Fuel', amount: 1200 }]" category="category" value="amount" />
</template>
`),

  table: vue(`
<script setup lang="ts">
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@manfad/ui'
</script>

<template>
  <Table>
    <TableCaption>Recent invoices</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Invoice</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>INV-001</TableCell>
        <TableCell>Paid</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
`),

  'data-table': vue(`
<script setup lang="ts">
import { DataTable } from '@manfad/ui'

const columns = [
  { key: 'name', label: 'Driver' },
  { key: 'region', label: 'Region' },
]
const rows = [
  { id: '1', name: 'Alice', region: 'Berlin' },
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" row-key="id" />
</template>
`),

  'grouped-table': vue(`
<script setup lang="ts">
import { GroupedTable } from '@manfad/ui'

const groups = [{
  key: 'q1',
  label: 'Q1 2026',
  columns: [
    { key: 'units', label: 'Units', footer: 'sum' },
    { key: 'revenue', label: 'Revenue', footer: 'sum' },
  ],
}]
const rows = [{ id: '1', units: 320, revenue: 16000 }]
</script>

<template>
  <GroupedTable :groups="groups" :rows="rows" row-key="id" />
</template>
`),

  'editable-table': vue(`
<script setup lang="ts">
import { ref } from 'vue'
import { GroupedTable } from '@manfad/ui'

const groups = [{
  key: 'stock',
  columns: [
    { key: 'product', label: 'Product' },
    { key: 'quantity', label: 'Qty', editable: true },
  ],
}]
const rows = ref([{ id: '1', product: 'Lamp', quantity: 26 }])
</script>

<template>
  <GroupedTable
    :groups="groups"
    :rows="rows"
    row-key="id"
    editable
    @save="({ row, key, value }) => Object.assign(row, { [key]: value })"
  />
</template>
`),

  'expandable-table': vue(`
<script setup lang="ts">
import { Expandable } from '@manfad/ui'

const columns = [
  { key: 'name', label: 'Driver' },
  { key: 'region', label: 'Region' },
]
const rows = [{
  id: 'AJ',
  name: 'Alice',
  region: 'Berlin',
  vehicles: [{ plate: 'B-AJ-101', make: 'Sprinter' }],
}]
</script>

<template>
  <Expandable :columns="columns" :rows="rows" row-key="id">
    <template #expanded="{ row }">
      <pre>{{ row.vehicles }}</pre>
    </template>
  </Expandable>
</template>
`),

  'check-table': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { CheckTable } from '@manfad/ui'

const selected = shallowRef<Array<string | number>>([])
const columns = [
  { key: 'name', label: 'Driver' },
  { key: 'region', label: 'Region' },
]
const rows = [{ id: 'AJ', name: 'Alice', region: 'Berlin' }]
</script>

<template>
  <CheckTable
    v-model="selected"
    :columns="columns"
    :rows="rows"
    row-key="id"
  />
</template>
`),

  timetable: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Timetable, type TimetableOrientation } from '@manfad/ui'

const orientation = shallowRef<TimetableOrientation>('vertical')
const days = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
]
const events = [
  { id: 1, day: 'mon', start: '08:00', end: '09:30', title: 'Lecture' },
]
</script>

<template>
  <Timetable :days="days" :events="events" :orientation="orientation" />
</template>
`),

  list: vue(`
<script setup lang="ts">
import { List, ListItem } from '@manfad/ui'
</script>

<template>
  <List>
    <ListItem>
      <p class="text-sm font-medium">Inbox</p>
      <p class="text-xs text-muted-foreground">12 unread</p>
    </ListItem>
  </List>
</template>
`),

  row: vue(`
<script setup lang="ts">
import { Card, CardContent, List, ListItem, Row, RowItem } from '@manfad/ui'
</script>

<template>
  <Row>
    <RowItem width="16rem">
      <Card><CardContent class="p-4">Sidebar</CardContent></Card>
    </RowItem>
    <RowItem main>
      <List>
        <ListItem>Main column content</ListItem>
      </List>
    </RowItem>
  </Row>
</template>
`),
}
