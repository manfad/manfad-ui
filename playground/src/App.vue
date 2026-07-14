<script setup lang="ts">
import { shallowRef } from 'vue'

import { Autocomplete } from '@/components/ui/autocomplete'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/date-picker'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sidebar, SidebarGroup, SidebarItem } from '@/components/ui/sidebar'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const inputValue = shallowRef('')
const dialogValue = shallowRef('')
const amount = shallowRef('')
const notificationsEnabled = shallowRef(false)
const autoSaveEnabled = shallowRef(true)
const selectedDate = shallowRef('')
const selectedCountry = shallowRef('')
const selectedCity = shallowRef('')
const cityOptions = ['Kuching', 'Kota Kinabalu', 'Kuala Lumpur', 'Penang', 'Ipoh', 'Johor Bahru']
</script>

<template>
  <div class="flex h-screen bg-background text-foreground">
    <Sidebar class="h-screen">
      <template #header>
        <div class="px-3 py-2 text-lg font-semibold">@yf/ui</div>
      </template>

      <SidebarGroup label="Overview">
        <SidebarItem active>
          <template #icon><span aria-hidden="true">O</span></template>
          Dashboard
        </SidebarItem>
        <SidebarItem>
          <template #icon><span aria-hidden="true">I</span></template>
          Invoices
        </SidebarItem>
        <SidebarItem>
          <template #icon><span aria-hidden="true">R</span></template>
          Reports
        </SidebarItem>
      </SidebarGroup>

      <SidebarGroup label="Settings">
        <SidebarItem>
          <template #icon><span aria-hidden="true">P</span></template>
          Profile
        </SidebarItem>
        <SidebarItem>
          <template #icon><span aria-hidden="true">S</span></template>
          Preferences
        </SidebarItem>
      </SidebarGroup>

      <template #footer>
        <p class="px-3 py-2 text-xs text-muted-foreground">Component playground</p>
      </template>
    </Sidebar>

    <main class="flex-1 overflow-y-auto p-8">
      <div class="mx-auto max-w-3xl space-y-8">
        <header class="space-y-1">
          <h1 class="text-2xl font-bold tracking-tight">Component preview</h1>
          <p class="text-sm text-muted-foreground">
            Review shared controls, overlays, navigation, and data display components.
          </p>
        </header>

        <Card><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Buttons</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
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

        <Card><CardContent class="space-y-4 p-6">
          <h2 class="text-lg font-semibold">Badges</h2>
          <div class="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent></Card>

        <Card><CardContent class="space-y-6 p-6">
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
        </CardContent></Card>

        <Card><CardContent class="space-y-4 p-6">
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

        <Card><CardContent class="space-y-4 p-6">
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

        <Card><CardContent class="space-y-4 p-6">
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
      </div>
    </main>
  </div>
</template>
