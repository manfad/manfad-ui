import { h, onBeforeUnmount, render } from 'vue'
import ChartTooltip from './ChartTooltip.vue'
import type { ChartTooltipItem } from './types'

export interface ChartTooltipContent {
  title?: string
  items: ChartTooltipItem[]
}

/**
 * Unovis tooltips take an HTML string or a DOM node, not a Vue tree. Keeping one
 * detached host element per chart lets us patch `ChartTooltip` into it on every
 * hover: Unovis re-appends the same node, so Vue diffs instead of re-creating.
 */
export function useChartTooltipRenderer() {
  let host: HTMLDivElement | undefined

  function renderTooltip(content: ChartTooltipContent): HTMLElement {
    if (!host)
      host = document.createElement('div')
    render(h(ChartTooltip, content), host)
    return host
  }

  onBeforeUnmount(() => {
    if (host) {
      render(null, host)
      host = undefined
    }
  })

  return renderTooltip
}
