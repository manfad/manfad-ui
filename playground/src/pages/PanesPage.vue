<script setup lang="ts">
import { shallowRef } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pane, PaneContainer } from '@/components/ui/panes'
import UsageExample from '../components/UsageExample.vue'
import { usageExamples } from '../usage-examples'

const usage = usageExamples.panes
const controlledSizes = shallowRef<number[]>([30, 70])
</script>

<template>
  <div class="flex flex-col gap-8">
    <Card>
      <CardHeader>
        <CardTitle>Single pane</CardTitle>
        <CardDescription>
          One pane fills the shell.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer class="h-40">
          <Pane class="p-3 text-sm">
            Single pane content
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>variant="vertical"</CardTitle>
        <CardDescription>
          Stacked panes (default). Adaptive equal share when size is omitted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="vertical" class="h-56">
          <Pane class="p-3 text-sm">
            Top
          </Pane>
          <Pane class="p-3 text-sm">
            Bottom
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>variant="horizontal"</CardTitle>
        <CardDescription>
          Side-by-side panes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" class="h-40">
          <Pane class="p-3 text-sm">
            Left
          </Pane>
          <Pane class="p-3 text-sm">
            Right
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>size</CardTitle>
        <CardDescription>
          Explicit percentages; unsized panes share the leftover space.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" class="h-40">
          <Pane :size="25" class="p-3 text-sm">
            size=25
          </Pane>
          <Pane class="p-3 text-sm">
            adaptive
          </Pane>
          <Pane class="p-3 text-sm">
            adaptive
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>resizable</CardTitle>
        <CardDescription>
          Drag the gutter (textbox-style resize cursor). Arrow keys nudge when focused.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" resizable class="h-48">
          <Pane :size="30" :min-size="15" class="p-3 text-sm">
            Left — drag the divider
          </Pane>
          <Pane class="p-3 text-sm">
            Right
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>border</CardTitle>
        <CardDescription>
          Optional border on the container (off by default).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" border class="h-40">
          <Pane class="p-3 text-sm">
            A
          </Pane>
          <Pane class="p-3 text-sm">
            B
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>square</CardTitle>
        <CardDescription>
          Sharp corners on the shell and panes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" square border class="h-40">
          <Pane class="p-3 text-sm">
            A
          </Pane>
          <Pane class="p-3 text-sm">
            B
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>v-model:sizes</CardTitle>
        <CardDescription>
          Controlled percentages.
        </CardDescription>
      </CardHeader>
      <CardContent class="flex flex-col gap-3">
        <PaneContainer
          v-model:sizes="controlledSizes"
          variant="horizontal"
          resizable
          class="h-40"
        >
          <Pane class="p-3 text-sm">
            {{ Math.round(controlledSizes[0] ?? 0) }}%
          </Pane>
          <Pane class="p-3 text-sm">
            {{ Math.round(controlledSizes[1] ?? 0) }}%
          </Pane>
        </PaneContainer>
        <p class="text-sm text-muted-foreground">
          sizes: {{ controlledSizes.map(n => Math.round(n)).join(', ') }}
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Nested</CardTitle>
        <CardDescription>
          Compositional nesting — any Pane can contain another PaneContainer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PaneContainer variant="horizontal" resizable border class="h-80">
          <Pane :size="28" :min-size="15" class="p-3 text-sm">
            Left
          </Pane>
          <Pane class="overflow-hidden p-0">
            <PaneContainer variant="vertical" resizable class="h-full p-0">
              <Pane :size="35" class="p-3 text-sm">
                Top
              </Pane>
              <Pane class="overflow-hidden p-0">
                <PaneContainer variant="horizontal" resizable class="h-full p-0">
                  <Pane class="p-3 text-sm">
                    Bottom left
                  </Pane>
                  <Pane :size="40" class="p-3 text-sm">
                    Bottom right
                  </Pane>
                </PaneContainer>
              </Pane>
            </PaneContainer>
          </Pane>
        </PaneContainer>
      </CardContent>
    </Card>

    <UsageExample :example="usage" />
  </div>
</template>
