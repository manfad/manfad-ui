<script setup lang="ts">
import { SelectionChips } from '@/components/ui/selection-chips'
import { Card, CardContent } from '@/components/ui/card'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples['selection-chips']

const groups = [
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

const values = [
  'item_create',
  'item_modify',
  'item_delete',
  'user_manage',
  'audit_view',
]
</script>

<template>
  <div class="space-y-8">
    <Card>
      <CardContent class="space-y-4 p-6">
        <div class="space-y-1">
          <h2 class="text-lg font-semibold">Selection chips</h2>
          <p class="text-sm text-muted-foreground">
            Group label, selected count, and expandable leaf chips.
          </p>
        </div>

        <SelectionChips
          :groups="groups"
          :values="values"
        />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
