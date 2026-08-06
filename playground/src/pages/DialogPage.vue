<script setup lang="ts">
import { shallowRef } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Label } from '@/components/ui/label'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.dialog
const dialogValue = shallowRef('')
const dialogSizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'] as const
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Dialog</CardTitle>
        <CardDescription>
          Modal overlays for forms and focused tasks.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium">
            Sizes
          </p>
          <div class="flex flex-wrap items-center gap-2">
            <Dialog v-for="size in dialogSizes" :key="size">
              <DialogTrigger as-child>
                <Button variant="outline" class="uppercase">
                  {{ size }}
                </Button>
              </DialogTrigger>
              <DialogContent :size="size">
                <DialogHeader>
                  <DialogTitle>Dialog size: {{ size }}</DialogTitle>
                  <DialogDescription>
                    Set via the <code class="text-xs">size</code> prop on
                    <code class="text-xs">DialogContent</code>.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose as-child>
                    <Button variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Dialog>
          <DialogTrigger as-child>
            <Button>
              Open dialog
            </Button>
          </DialogTrigger>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>Edit preview value</DialogTitle>
              <DialogDescription>
                Enter a value to check form controls inside a large dialog.
              </DialogDescription>
            </DialogHeader>
            <div class="flex flex-col gap-2">
              <Label for="dialog-input">Dialog value</Label>
              <Input
                id="dialog-input"
                v-model="dialogValue"
                placeholder="Type a dialog value"
              />
            </div>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
