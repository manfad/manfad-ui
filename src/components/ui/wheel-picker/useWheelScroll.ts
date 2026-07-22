import type { MaybeRefOrGetter, Ref } from 'vue'
import { onBeforeUnmount, onMounted, toValue } from 'vue'

export interface UseWheelScrollOptions {
  itemHeight: MaybeRefOrGetter<number>
  count: MaybeRefOrGetter<number>
  loop: MaybeRefOrGetter<boolean>
  /**
   * Called when scrolling settles on a centered row. Receives the centered real
   * index and returns the final index to rest on (allowing the caller to skip
   * disabled options). The wheel scrolls to the returned index if it differs.
   */
  onSettle: (centeredIndex: number) => number
  /** Called on every scroll frame with the current centered real index. */
  onScroll?: (centeredIndex: number) => void
}

/**
 * Owns the scroll-snap wheel mechanics for a single column: mapping scroll
 * position to a looping index, programmatic centering, continuous recentering
 * for the infinite loop, and settle detection (native `scrollend` with a
 * debounced fallback for browsers such as Chrome 109 that lack it).
 */
export function useWheelScroll(
  scroller: Ref<HTMLElement | null>,
  options: UseWheelScrollOptions,
) {
  const hasScrollEnd = typeof window !== 'undefined' && 'onscrollend' in window
  let settleTimer: ReturnType<typeof setTimeout> | null = null
  let recenterFrame = 0

  function copyOffset(count: number): number {
    return toValue(options.loop) ? count : 0
  }

  function realIndexFromScroll(): number {
    const el = scroller.value
    const count = toValue(options.count)
    const itemHeight = toValue(options.itemHeight)
    if (!el || count === 0)
      return 0
    const renderIndex = Math.round(el.scrollTop / itemHeight)
    const raw = renderIndex - copyOffset(count)
    return ((raw % count) + count) % count
  }

  function scrollToReal(index: number, smooth: boolean) {
    const el = scroller.value
    if (!el)
      return
    const count = toValue(options.count)
    const itemHeight = toValue(options.itemHeight)
    const top = (index + copyOffset(count)) * itemHeight

    if (smooth)
      el.scrollTo({ top, behavior: 'smooth' })
    else
      el.scrollTop = top
  }

  // Shift the position by exactly one copy whenever it drifts out of the
  // middle copy, so loop scrolling never runs out of runway. The shift is a
  // whole number of items and every copy renders identical content, so it is
  // invisible even mid-gesture. Called continuously during scroll (see
  // handleScroll) so the seam never coincides with a settle-time jump; the
  // call in commit() is only a safety net.
  function recenter() {
    if (!toValue(options.loop) || !scroller.value)
      return
    const el = scroller.value
    const count = toValue(options.count)
    const itemHeight = toValue(options.itemHeight)
    if (count === 0)
      return
    const renderIndex = Math.round(el.scrollTop / itemHeight)
    if (renderIndex < count)
      el.scrollTop += count * itemHeight
    else if (renderIndex >= count * 2)
      el.scrollTop -= count * itemHeight
  }

  function commit() {
    const centered = realIndexFromScroll()
    const final = options.onSettle(centered)
    if (final !== centered)
      scrollToReal(final, false)
    recenter()
  }

  function scheduleSettle() {
    if (settleTimer)
      clearTimeout(settleTimer)
    settleTimer = setTimeout(commit, 120)
  }

  function handleScroll() {
    options.onScroll?.(realIndexFromScroll())
    // Recenter before the next paint so the loop seam is crossed invisibly
    // instead of with a jump when the scroll settles.
    if (toValue(options.loop) && !recenterFrame) {
      recenterFrame = requestAnimationFrame(() => {
        recenterFrame = 0
        recenter()
      })
    }
    if (!hasScrollEnd)
      scheduleSettle()
  }

  onMounted(() => {
    if (hasScrollEnd)
      scroller.value?.addEventListener('scrollend', commit)
  })

  onBeforeUnmount(() => {
    if (settleTimer)
      clearTimeout(settleTimer)
    if (recenterFrame)
      cancelAnimationFrame(recenterFrame)
    if (hasScrollEnd)
      scroller.value?.removeEventListener('scrollend', commit)
  })

  return { realIndexFromScroll, scrollToReal, handleScroll }
}
