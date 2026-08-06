<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { Excel, ExcelExport, ExcelImport, type ExcelColumn } from '@/components/ui/excel'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.excel

const columns: ExcelColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'phone', label: 'Phone' },
  { key: 'workhour', label: 'Work hours', type: 'number' },
  { key: 'salary', label: 'Salary', type: 'number' },
]

const tableColumns: DataTableColumn[] = columns.map(column => ({
  key: column.key,
  label: column.label,
}))

const rows = shallowRef<Record<string, unknown>[]>([
  { id: '001', phone: '012-3456789', workhour: 160, salary: 3200 },
  { id: '002', phone: '019-8765432', workhour: 152, salary: 2800 },
  { id: '003', phone: '011-2233445', workhour: 168, salary: 3500 },
])
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Excel</CardTitle>
        <CardDescription>
          Optional DLC for spreadsheet import/export. Pass the same
          <code class="text-xs">columns</code>
          as your table; import replaces
          <code class="text-xs">rows</code>.
          Phone / ID stay strings so leading zeros survive.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <Excel v-model:rows="rows" :columns="columns" filename="payroll">
          <ExcelExport text="Export Excel" format="xlsx" />
          <ExcelExport text="Export CSV" format="csv" icon="i-lucide-file-spreadsheet" />
          <ExcelImport text="Import" />
        </Excel>

        <DataTable :columns="tableColumns" :rows="rows" row-key="id" />
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
