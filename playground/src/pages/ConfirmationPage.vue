<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
} from '@/components/ui/alert-dialog'
import { toast } from '@/components/ui/toast'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.confirmation

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
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Confirmation</CardTitle>
        <CardDescription>
          Declarative AlertDialog or imperative <code class="text-xs">confirm()</code> for destructive choices.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-wrap items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="outline">
              Declarative confirm
            </Button>
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
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
