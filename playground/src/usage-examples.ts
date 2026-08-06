import type { ComponentSectionId } from './sections'

export interface UsageExample {
  content: string
}

function vue(content: string): UsageExample {
  return { content: content.trim() }
}

export const usageExamples: Record<ComponentSectionId, UsageExample> = {
  'sidebar-switcher': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { SidebarSwitcher } from '@manfad/ui'

const context = shallowRef('docs')
const items = [
  { value: 'docs', label: 'Document' },
  { value: 'playground', label: 'Playground' },
]
</script>

<template>
  <SidebarSwitcher
    v-model="context"
    title="@manfad99/ui"
    icon="i-lucide-layers"
    :items="items"
  />
</template>
`),

  'md-view': vue(`
<script setup lang="ts">
import { MdView } from '@manfad/ui/md-view'
import guide from './guide.md?raw'
</script>

<template>
  <!-- Recommended for a Markdown file bundled from this repository -->
  <MdView :content="guide" />

  <!-- Use src for a public or API-served Markdown file -->
  <MdView src="/docs/guide.md" />
</template>
`),

  gallery: vue(`
<script setup lang="ts">
import { Gallery, type GalleryItem } from '@manfad/ui'

const items: GalleryItem[] = [
  { src: '/media/photo-1.jpg', alt: 'Front view' },
  { src: '/media/photo-2.jpg', alt: 'Detail view' },
  { src: '/media/demo.mp4', type: 'video', poster: '/media/poster.jpg' },
]
</script>

<template>
  <Gallery
    :items="items"
    title="Product media"
    preview-position="right"
    :preview-height="480"
    :max-preview-items="6"
    black
  />
</template>
`),

  image: vue(`
<script setup lang="ts">
import { createApp, provide } from 'vue'
import {
  createCdnImageProvider,
  Image,
  IMAGE_PROVIDER_KEY,
} from '@manfad/ui'

// App bootstrap (once):
// const app = createApp(App)
// app.provide(IMAGE_PROVIDER_KEY, createCdnImageProvider(import.meta.env.VITE_CDN))

provide(
  IMAGE_PROVIDER_KEY,
  createCdnImageProvider('https://cdn.example.com'),
)
</script>

<template>
  <Image
    src="uploads/photo.webp"
    alt="Product"
    :width="1600"
    :height="900"
    sizes="(max-width: 768px) 100vw, 768px"
    class="w-full rounded-md"
  />

  <Image
    src="/photo.jpg"
    alt="Local"
    fallback="/placeholder.jpg"
    priority
    class="size-40 rounded-md"
  />
</template>
`),

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
  <Badge clickable @click="() => {}">Clickable</Badge>
</template>
`),

  'selection-chips': vue(`
<script setup lang="ts">
import { SelectionChips } from '@manfad/ui'

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
  <SelectionChips :groups="groups" :values="values" />
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
import { ThemeSwitcher } from '@manfad/ui'
</script>

<template>
  <ThemeSwitcher />
  <!-- Optional custom storage key (separate store from the default) -->
  <ThemeSwitcher storage-key="manfad-ui-theme-alt" />
</template>
`),

  input: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Input, Label } from '@manfad/ui'

const value = shallowRef('')
</script>

<template>
  <Label for="name">Name</Label>
  <Input id="name" v-model="value" placeholder="Type here" />
</template>
`),

  checkbox: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox, Label } from '@manfad/ui'

const checked = shallowRef(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox id="agree" v-model="checked" />
    <Label for="agree">I agree</Label>
  </div>
</template>
`),

  switch: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Label, Switch } from '@manfad/ui'

const enabled = shallowRef(true)
</script>

<template>
  <div class="flex items-center gap-2">
    <Switch id="auto-save" v-model="enabled" />
    <Label for="auto-save">Auto-save</Label>
  </div>
</template>
`),

  select: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@manfad/ui'

const value = shallowRef<string>()
</script>

<template>
  <Label for="country">Country</Label>
  <Select v-model="value">
    <SelectTrigger id="country">
      <SelectValue placeholder="Pick one" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="malaysia">Malaysia</SelectItem>
      <SelectItem value="singapore">Singapore</SelectItem>
    </SelectContent>
  </Select>
</template>
`),

  autocomplete: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Autocomplete, Label } from '@manfad/ui'

const city = shallowRef('')
const cities = ['Kuching', 'Miri', 'Bintulu']
</script>

<template>
  <Label for="city">City</Label>
  <Autocomplete
    id="city"
    v-model="city"
    :options="cities"
    placeholder="Start typing a city"
  />
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
import { NumberInput } from '@manfad/ui'

const qty = shallowRef<number | null>(0)
</script>

<template>
  <NumberInput v-model="qty" :min="0" />
</template>
`),

  textarea: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Textarea } from '@manfad/ui'

const notes = shallowRef('')
</script>

<template>
  <Textarea v-model="notes" placeholder="Notes" />
</template>
`),

  toggle: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toggle } from '@manfad/ui'

const bold = shallowRef(false)
</script>

<template>
  <Toggle v-model="bold">Bold</Toggle>
</template>
`),

  'mode-toggle': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Mode, ModeToggle } from '@manfad/ui'

const mode = shallowRef('docs')
</script>

<template>
  <ModeToggle v-model="mode" shortcut="d">
    <Mode value="docs">Document</Mode>
    <Mode value="playground">Playground</Mode>
    <Mode value="extra">Extra</Mode>
  </ModeToggle>
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

  'date-filter': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  DateFilter,
  type DateFilterMode,
  type DateSelection,
  type MonthSelection,
} from '@manfad/ui'

const date = shallowRef<string>()
const dateEnd = shallowRef<string>()
const dateMode = shallowRef<DateFilterMode>('date')
const dateSelection = shallowRef<DateSelection>('single')
const monthSelection = shallowRef<MonthSelection>('single')
</script>

<template>
  <DateFilter
    v-model="date"
    v-model:end="dateEnd"
    v-model:mode="dateMode"
    v-model:selection="dateSelection"
    v-model:month-selection="monthSelection"
    label="Date"
    placeholder="dd/mm/yyyy"
  />
</template>
`),

  radio: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Label, Radio, RadioGroup } from '@manfad/ui'

const status = shallowRef('open')
</script>

<template>
  <RadioGroup v-model="status">
    <div class="flex items-center gap-2">
      <Radio id="open" value="open" />
      <Label for="open">Open</Label>
    </div>
    <div class="flex items-center gap-2">
      <Radio id="closed" value="closed" />
      <Label for="closed">Closed</Label>
    </div>
  </RadioGroup>
</template>
`),

  choice: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  Choice,
  type ChoiceOption,
} from '@manfad/ui'

const categories = shallowRef<string[]>(['fuel'])
const status = shallowRef<string[]>(['open'])

const categoryOptions: ChoiceOption[] = [
  { value: 'fine', label: 'Fine' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'insurance', label: 'Insurance' },
]

const statusOptions: ChoiceOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress', disabled: true },
  { value: 'closed', label: 'Closed' },
]
</script>

<template>
  <Choice
    v-model="categories"
    label="Category"
    separator
    :options="categoryOptions"
  />

  <Choice
    v-model="status"
    variant="radio"
    label="Status"
    :options="statusOptions"
  />
</template>
`),

  'choice-card': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  ChoiceCard,
  type ChoiceCardOption,
} from '@manfad/ui'

const plan = shallowRef<string[]>(['plus'])
const features = shallowRef<string[]>(['analytics'])

const planOptions: ChoiceCardOption[] = [
  {
    value: 'plus',
    label: 'Plus',
    description: 'For individuals and small teams.',
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For growing businesses.',
  },
]

const featureOptions: ChoiceCardOption[] = [
  {
    value: 'analytics',
    label: 'Analytics',
    description: 'Track usage and performance.',
  },
  {
    value: 'support',
    label: 'Priority support',
    description: 'Faster response from the team.',
    disabled: true,
  },
]
</script>

<template>
  <ChoiceCard
    v-model="plan"
    label="Plan"
    :options="planOptions"
  />

  <ChoiceCard
    v-model="features"
    variant="checkbox"
    indicator
    position="start"
    label="Features"
    :options="featureOptions"
  />
</template>
`),

  filter: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import {
  Filter,
  type FilterOption,
} from '@manfad/ui'

const categories = shallowRef<string[]>(['fuel'])
const status = shallowRef<string[]>(['open'])

const categoryOptions: FilterOption[] = [
  { value: 'fine', label: 'Fine' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'insurance', label: 'Insurance' },
]

const statusOptions: FilterOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]
</script>

<template>
  <Filter
    v-model="categories"
    label="Category"
    :options="categoryOptions"
  />

  <Filter
    v-model="status"
    variant="radio"
    label="Status"
    :options="statusOptions"
  />
</template>
`),

  'input-clear': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { InputClear } from '@manfad/ui'

const query = shallowRef<string | number>()
</script>

<template>
  <InputClear
    v-model="query"
    start-icon="i-lucide-search"
    placeholder="Search expenses"
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

const tab = shallowRef('intake')
</script>

<template>
  <Tabs v-model="tab">
    <TabsList>
      <TabsTrigger value="day">Day</TabsTrigger>
      <TabsTrigger value="week">Week</TabsTrigger>
    </TabsList>
  </Tabs>

  <Tabs v-model="tab">
    <TabsList variant="underline">
      <TabsTrigger value="intake">Intake area</TabsTrigger>
      <TabsTrigger value="booking">Booking strength</TabsTrigger>
      <TabsTrigger value="hold">Hold risk</TabsTrigger>
    </TabsList>
    <TabsContent value="intake">Intake area</TabsContent>
    <TabsContent value="booking">Booking strength</TabsContent>
    <TabsContent value="hold">Hold risk</TabsContent>
  </Tabs>
</template>
`),

  wheel: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { WheelPicker, WheelPickerColumn } from '@manfad/ui'

const city = shallowRef('Kuching')
</script>

<template>
  <WheelPicker>
    <WheelPickerColumn v-model="city" :options="['Kuching', 'Miri', 'Bintulu']" />
  </WheelPicker>
</template>
`),

  'time-picker': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { TimePicker } from '@manfad/ui'

const time = shallowRef('14:30')
</script>

<template>
  <TimePicker v-model="time" />
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
import { Progress } from '@manfad/ui'

const value = shallowRef(33)
</script>

<template>
  <Progress v-model="value" />
  <Progress v-model="value" variant="circle" />
  <Progress v-model="value" variant="circle" :size="64">
    <template #default="{ percent }">
      {{ Math.round(percent) }}%
    </template>
  </Progress>
</template>
`),

  spinner: vue(`
<script setup lang="ts">
import { Button, Spinner } from '@manfad/ui'
</script>

<template>
  <Spinner />
  <Spinner class="size-8" />
  <Button disabled>
    <Spinner class="text-primary-foreground" data-icon="inline-start" />
    Saving…
  </Button>
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
  <Stepper v-model="step" :steps="steps" variant="dots" />
  <Stepper v-model="step" :steps="steps" variant="counter" />
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

  'hover': vue(`
<script setup lang="ts">
import { Hover, HoverContent, HoverTrigger } from '@manfad/ui'
</script>

<template>
  <Hover>
    <HoverTrigger>@manfad/ui</HoverTrigger>
    <HoverContent>
      Shared Vue 3 admin UI kit.
    </HoverContent>
  </Hover>
</template>
`),

  'dropdown': vue(`
<script setup lang="ts">
import { Button, Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '@manfad/ui'
</script>

<template>
  <Dropdown>
    <DropdownTrigger as-child>
      <Button variant="outline">Actions</Button>
    </DropdownTrigger>
    <DropdownContent>
      <DropdownItem>Edit</DropdownItem>
      <DropdownItem>Delete</DropdownItem>
    </DropdownContent>
  </Dropdown>
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

  calendar: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Calendar } from '@manfad/ui'

const selectedDate = shallowRef('2026-07-31')
const rangeStart = shallowRef('2026-07-06')
const rangeEnd = shallowRef('2026-07-17')
const availableDate = shallowRef('2026-07-23')

const restDays = ['Sunday']
const excludedDates = ['2026-07-04', '2026-07-18']
</script>

<template>
  <!-- Single date and root class -->
  <Calendar
    v-model="selectedDate"
    class="rounded-lg border p-3"
  />

  <!-- Date range -->
  <Calendar
    range
    v-model:start="rangeStart"
    v-model:end="rangeEnd"
  />

  <!-- Rest days, exclusions, and custom state classes -->
  <Calendar
    v-model="availableDate"
    :restday="restDays"
    :exclude="excludedDates"
    restday-class="bg-warning/20 text-warning-foreground opacity-100"
    exclude-class="bg-destructive/10 text-destructive opacity-100 line-through"
  />
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

  dialog: vue(`
<script setup lang="ts">
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@manfad/ui'
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
</template>
`),

  popover: vue(`
<script setup lang="ts">
import { Button, Popover, PopoverContent, PopoverTrigger } from '@manfad/ui'
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent>Popover body</PopoverContent>
  </Popover>
</template>
`),

  toast: vue(`
<script setup lang="ts">
import { Button, toast, Toaster } from '@manfad/ui'
</script>

<template>
  <Button @click="toast.info({ title: 'Saved' })">Toast</Button>
  <Toaster />
</template>
`),

  confirmation: vue(`
<script setup lang="ts">
import { Button, confirm, toast, Toaster, Confirmation } from '@manfad/ui'

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
  <Button variant="danger" @click="onDelete">Confirm</Button>
  <Toaster />
  <Confirmation />
</template>
`),

  skeleton: vue(`
<script setup lang="ts">
import { Skeleton } from '@manfad/ui'
</script>

<template>
  <div aria-label="Loading profile" aria-busy="true" class="flex items-center gap-3">
    <Skeleton class="size-10 rounded-full" />
    <div class="flex-1 space-y-2">
      <Skeleton class="h-4 w-48" />
      <Skeleton class="h-3 w-32" />
    </div>
  </div>
</template>
`),

  empty: vue(`
<script setup lang="ts">
import { Button, Empty } from '@manfad/ui'
</script>

<template>
  <Empty title="No items yet" description="Create your first item to get started.">
    <Button>Create item</Button>
  </Empty>
</template>
`),

  error: vue(`
<script setup lang="ts">
import { ErrorPage } from '@manfad/ui'

function retryRequest() {}
function goHome() {}
</script>

<template>
  <ErrorPage variant="error" @retry="retryRequest" @home="goHome" />
</template>
`),

  unauthorized: vue(`
<script setup lang="ts">
import { ErrorPage } from '@manfad/ui'

function signIn() {}
function goBack() {}
</script>

<template>
  <ErrorPage variant="unauthorized" @sign-in="signIn" @back="goBack" />
</template>
`),

  'no-permission': vue(`
<script setup lang="ts">
import { ErrorPage } from '@manfad/ui'

function goBack() {}
function requestAccess() {}
</script>

<template>
  <ErrorPage variant="no-permission" @back="goBack" @request-access="requestAccess" />
</template>
`),

  'page-loading': vue(`
<script setup lang="ts">
import { PageLoading } from '@manfad/ui'
</script>

<template>
  <PageLoading description="Fetching the latest data for this page." />
</template>
`),

  'loading-dialog': vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button, LoadingDialog } from '@manfad/ui'

const open = shallowRef(false)
</script>

<template>
  <Button @click="open = true">Start upload</Button>
  <LoadingDialog
    v-model:open="open"
    title="Uploading files"
    description="Please keep this window open."
    :progress="68"
  />
</template>
`),

  'time-badge': vue(`
<script setup lang="ts">
import { TimeBadge } from '@manfad/ui/time-badge'

const createdAt = new Date(Date.now() - 62 * 24 * 60 * 60 * 1000)
</script>

<template>
  <TimeBadge :time="createdAt" />
  <TimeBadge :time="createdAt" short />
  <TimeBadge :time="createdAt" short icon />
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
  <SignatureDialog
    v-model:open="open"
    filename="customer-signature.png"
    @save="url = $event"
  />
  <img v-if="url" :src="url" alt="Signature" />
</template>
`),

  'line-chart': vue(`
<script setup lang="ts">
import { LineChart } from '@manfad/ui/chart'

const data = [{ month: new Date(2025, 0, 1), kuching: 18420, miri: 12980 }]
const series = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
]
</script>

<template>
  <LineChart :data="data" x="month" :series="series" />
</template>
`),

  'area-chart': vue(`
<script setup lang="ts">
import { AreaChart } from '@manfad/ui/chart'

const data = [{ month: new Date(2025, 0, 1), fuel: 18, labour: 12 }]
const series = [
  { key: 'fuel', label: 'Fuel' },
  { key: 'labour', label: 'Labour' },
]
</script>

<template>
  <AreaChart :data="data" x="month" :series="series" stacked />
</template>
`),

  'bar-chart': vue(`
<script setup lang="ts">
import { BarChart } from '@manfad/ui/chart'

const data = [{ month: 'Jan', kuching: 1200, miri: 900 }]
const series = [
  { key: 'kuching', label: 'Kuching' },
  { key: 'miri', label: 'Miri' },
]
</script>

<template>
  <BarChart :data="data" x="month" :series="series" />
</template>
`),

  'donut-chart': vue(`
<script setup lang="ts">
import { DonutChart } from '@manfad/ui/chart'
</script>

<template>
  <DonutChart
    :data="[{ category: 'Fuel', amount: 1200 }, { category: 'Labour', amount: 800 }]"
    label="category"
    value="amount"
  />
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

  excel: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { DataTable } from '@manfad/ui'
import { Excel, ExcelExport, ExcelImport, type ExcelColumn } from '@manfad/ui/excel'

const columns: ExcelColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'workhour', label: 'Work hours', type: 'number' },
  { key: 'salary', label: 'Salary', type: 'number' },
]

const rows = shallowRef([
  { id: '001', phone: '012-3456789', workhour: 160, salary: 3200 },
])
</script>

<template>
  <Excel v-model:rows="rows" :columns="columns" filename="payroll">
    <ExcelExport text="Export Excel" format="xlsx" />
    <ExcelExport text="Export CSV" format="csv" />
    <ExcelImport text="Import" />
  </Excel>

  <DataTable :columns="columns" :rows="rows" row-key="id" />
</template>
`),

  'collapsible-table': vue(`
<script setup lang="ts">
import { CollapsibleTable } from '@manfad/ui'

const columns = [
  { key: 'id', label: 'ID', width: '5rem' },
  { key: 'name', label: 'Name', width: '9rem' },
  { key: 'email', label: 'Email', width: '12rem' },
  { key: 'country', label: 'Country', width: '6rem' },
]
const columnGroups = [
  { id: 'info', label: 'Info', columns: ['id', 'name', 'email'] },
]
const rows = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@acme.co', country: 'US' },
]
</script>

<template>
  <CollapsibleTable
    :columns="columns"
    :column-groups="columnGroups"
    :rows="rows"
    row-key="id"
  >
    <template #collapsed-info="{ row }">
      <span class="font-medium">{{ row.name }}</span>
      <span class="text-muted-foreground"> · {{ row.email }}</span>
    </template>
  </CollapsibleTable>
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

  panes: vue(`
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Pane, PaneContainer } from '@manfad/ui'

const sizes = shallowRef<number[]>([30, 70])
</script>

<template>
  <PaneContainer variant="horizontal" resizable border class="h-64">
    <Pane :size="25" class="p-3">Left</Pane>
    <Pane class="overflow-hidden p-0">
      <PaneContainer variant="vertical" resizable class="h-full p-0">
        <Pane :size="40" class="p-3">Top</Pane>
        <Pane class="p-3">Bottom</Pane>
      </PaneContainer>
    </Pane>
  </PaneContainer>

  <PaneContainer v-model:sizes="sizes" variant="horizontal" resizable square border class="h-40">
    <Pane class="p-3">A</Pane>
    <Pane class="p-3">B</Pane>
  </PaneContainer>
</template>
`),
}
