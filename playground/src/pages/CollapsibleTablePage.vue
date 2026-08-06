<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CollapsibleTable } from '@/components/ui/collapsible-table'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'
import { memberColumnGroups, memberColumns, memberRows, memberRoleVariant } from '../demo-state'

const usage = usageExamples['collapsible-table']
</script>

<template>
  <div class="space-y-8">
    <Card>
      <CardContent class="space-y-4 p-6">
        <h2 class="text-lg font-semibold">Collapsible column groups</h2>
        <p class="text-sm text-muted-foreground">
          Pass <code class="rounded bg-muted px-1 py-0.5 text-xs">columnGroups</code> alongside flat columns.
          Each group references columns by id, renders a single collapsed cell, and expands into its
          members on chevron click.
        </p>
        <div class="overflow-hidden rounded-lg border">
          <CollapsibleTable
            :columns="memberColumns"
            :column-groups="memberColumnGroups"
            :rows="memberRows"
            row-key="id"
          >
            <template #collapsed-info="{ row }">
              <span class="font-medium">{{ row.name }}</span>
              <span class="text-muted-foreground"> · {{ row.email }}</span>
            </template>
            <template #cell-role="{ value }">
              <Badge :variant="memberRoleVariant(String(value))">
                {{ value }}
              </Badge>
            </template>
          </CollapsibleTable>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent class="space-y-4 p-6">
        <h2 class="text-lg font-semibold">Default collapsed cell</h2>
        <p class="text-sm text-muted-foreground">
          Without a <code class="rounded bg-muted px-1 py-0.5 text-xs">#collapsed-&#123;id&#125;</code> slot,
          the collapsed cell stacks every member value; <code class="rounded bg-muted px-1 py-0.5 text-xs">defaultExpanded</code>
          starts a group open.
        </p>
        <div class="overflow-hidden rounded-lg border">
          <CollapsibleTable
            :columns="memberColumns"
            :column-groups="[{ ...memberColumnGroups[0], defaultExpanded: true }]"
            :rows="memberRows"
            row-key="id"
          >
            <template #cell-role="{ value }">
              <Badge :variant="memberRoleVariant(String(value))">
                {{ value }}
              </Badge>
            </template>
          </CollapsibleTable>
        </div>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
