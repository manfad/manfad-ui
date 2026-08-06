<script lang="ts">
export interface CodeBlockProps {
  content: string
  class?: import('vue').HTMLAttributes['class']
}
</script>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type FormattedPart =
  | { kind: 'plain'; text: string }
  | { kind: 'comment'; text: string }
  | { kind: 'mixed'; code: string; comment: string }

const props = defineProps<{
  content: string
  class?: HTMLAttributes['class']
}>()

const codeFontFamily =
  "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace"

const source = computed(() => props.content.trim())

const lines = computed(() =>
  source.value.split('\n').map(line => ({
    text: line,
    formatted: formatLine(line),
  })),
)

function findCommentIndex(line: string): number {
  let i = 0
  while (i < line.length - 1) {
    if (line[i] === '/' && line[i + 1] === '/') {
      if (i > 0 && line[i - 1] === ':') {
        i += 2
        continue
      }
      return i
    }
    i++
  }
  return -1
}

function formatLine(line: string): FormattedPart {
  if (line.trimStart().startsWith('//'))
    return { kind: 'comment', text: line }

  const idx = findCommentIndex(line)
  if (idx > 0) {
    return {
      kind: 'mixed',
      code: line.slice(0, idx),
      comment: line.slice(idx),
    }
  }

  return { kind: 'plain', text: line }
}
</script>

<template>
  <div
    :class="cn(
      'flex min-h-0 w-full max-w-full flex-col overflow-hidden rounded-xl border border-muted bg-muted/30 text-sm shadow-sm',
      props.class,
    )"
  >
    <div
      class="min-h-0 flex-1 overflow-auto bg-muted/20 p-4 text-[13px] leading-relaxed"
      :style="{ fontFamily: codeFontFamily }"
    >
      <table class="border-collapse">
        <tbody>
          <tr
            v-for="(line, i) in lines"
            :key="i"
          >
            <td class="select-none pr-4 text-right align-top text-muted-foreground/40">
              {{ i + 1 }}
            </td>
            <td class="whitespace-pre"><span
              v-if="line.formatted.kind === 'comment'"
              class="italic text-muted-foreground/60"
            >{{ line.formatted.text }}</span><template v-else-if="line.formatted.kind === 'mixed'">{{ line.formatted.code }}<span class="italic text-muted-foreground/60">{{ line.formatted.comment }}</span></template><template v-else>{{ line.formatted.text }}</template></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
