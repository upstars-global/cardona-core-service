import { type Ref, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type Dir = 'up' | 'down' | null
type Mode = 'element' | 'window'

interface Options {
  mode?: Mode
  selector?: string
  root?: Ref<HTMLElement | null>
  bottomThreshold?: number
}

interface Return {
  top: Ref<number>
  scrollHeight: Ref<number>
  clientHeight: Ref<number>
  isTop: Ref<boolean>
  isBottom: Ref<boolean>
  direction: Ref<Dir>
  percentToTop: Ref<number>
  percentToBottom: Ref<number>
  scrollToPercent: (percent: number, opts?: { from?: 'top' | 'bottom'; smooth?: boolean }) => void
  scrollToSelector: (childSelector: string, smooth?: boolean) => void
  reinitialize: () => void
}

// Overload types for useScrollObserver:
export function useScrollObserver(selector: string): Return
export function useScrollObserver(opts?: Options): Return
export function useScrollObserver(arg?: string | Options): Return {
  const isString = typeof arg === 'string'

  const opts: Required<Options> = {
    mode: isString ? 'element' : (arg?.mode ?? 'element'),
    selector: isString ? (arg as string) : (arg?.selector ?? ''),
    root: (isString ? undefined : arg?.root) as any,
    bottomThreshold: isString ? 1 : (arg?.bottomThreshold ?? 1),
  } as any

  const top = ref(0)
  const scrollHeight = ref(0)
  const clientHeight = ref(0)
  const isTop = ref(true)
  const isBottom = ref(false)
  const direction = ref<Dir>(null)
  const percentToTop = ref(0)
  const percentToBottom = ref(100)

  let lastScrollTop = 0
  let scrollEl: HTMLElement | null = null
  let attached = false

  const getWindowEl = () =>
    (document.scrollingElement || document.documentElement) as HTMLElement

  const resolveScrollEl = (): HTMLElement | null => {
    if (opts.mode === 'window')
      return getWindowEl()

    // element mode:
    if (opts.root?.value) {
      return opts.selector
        ? (opts.root.value.querySelector(opts.selector) as HTMLElement | null)
        : opts.root.value
    }

    // якщо root не заданий — шукаємо в document
    return opts.selector ? (document.querySelector(opts.selector) as HTMLElement | null) : null
  }

  const updateFrom = (el: HTMLElement) => {
    const st = el.scrollTop
    const sh = el.scrollHeight
    const ch = el.clientHeight
    const max = Math.max(0, sh - ch)

    top.value = st
    scrollHeight.value = sh
    clientHeight.value = ch

    isTop.value = st <= 0
    isBottom.value = st >= max - opts.bottomThreshold

    direction.value = st > lastScrollTop ? 'down' : st < lastScrollTop ? 'up' : null
    lastScrollTop = st

    const pct = max ? (st / max) * 100 : 0
    const clamped = Math.min(100, Math.max(0, pct))

    percentToTop.value = Math.round(clamped)
    percentToBottom.value = Math.round(100 - clamped)
  }

  const onScroll = () => {
    if (scrollEl)
      updateFrom(scrollEl)
  }

  const attach = () => {
    detach()
    scrollEl = resolveScrollEl()
    if (!scrollEl)
      return
    const target: EventTarget = opts.mode === 'window' ? window : scrollEl

    target.addEventListener('scroll', onScroll, { passive: true })
    updateFrom(scrollEl)
    attached = true
  }

  const detach = () => {
    if (!attached)
      return
    const target: EventTarget | null = opts.mode === 'window' ? window : scrollEl
    if (target)
      target.removeEventListener('scroll', onScroll)
    scrollEl = null
    attached = false
  }

  const reinitialize = () => attach()

  // ---- helpers ----
  const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

  function scrollToPercent(
    percent: number,
    o: { from?: 'top' | 'bottom'; smooth?: boolean } = {},
  ) {
    if (!scrollEl)
      return
    const p = clamp(percent, 0, 100)
    const max = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight)
    const from = o.from ?? 'top'
    const topPx = from === 'bottom' ? max - (p / 100) * max : (p / 100) * max
    if (opts.mode === 'window')
      window.scrollTo({ top: topPx, behavior: o.smooth ? 'smooth' : 'auto' })
    else
      scrollEl.scrollTo({ top: topPx, behavior: o.smooth ? 'smooth' : 'auto' })
  }

  function scrollToSelector(childSelector: string, smooth = false) {
    if (!scrollEl)
      return

    const target
      = opts.mode === 'window'
        ? (document.querySelector(childSelector) as HTMLElement | null)
        : (scrollEl.querySelector(childSelector) as HTMLElement | null)

    if (!target)
      return

    // Обчислити offset до контейнера (для element mode)
    const getOffsetTopWithin = (el: HTMLElement, within: HTMLElement) => {
      let y = 0
      let node: HTMLElement | null = el
      while (node && node !== within && node instanceof HTMLElement) {
        y += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }

      return y
    }

    const topPx
      = opts.mode === 'window'
        ? target.getBoundingClientRect().top + window.scrollY
        : getOffsetTopWithin(target, scrollEl)

    if (opts.mode === 'window')
      window.scrollTo({ top: topPx, behavior: smooth ? 'smooth' : 'auto' })
    else
      scrollEl.scrollTo({ top: topPx, behavior: smooth ? 'smooth' : 'auto' })
  }

  // lifecycle
  onMounted(attach)
  onBeforeUnmount(detach)

  // якщо root змінюється (наприклад, VDataTable перемонтувався) — перевішуємо
  watch(() => opts.root?.value, () => queueMicrotask(attach))

  return {
    top,
    scrollHeight,
    clientHeight,
    isTop,
    isBottom,
    direction,
    percentToTop,
    percentToBottom,
    scrollToPercent,
    scrollToSelector,
    reinitialize,
  }
}

// Composable for getting a range of items based on the visible index and range size
export function getRange(index: number, range: number): { start: number; end: number } {
  const start = index * range
  const end = start + range

  return { start, end }
}

export const getOptimizedList = <T>(
  list: T[],
  visibleIndex: number,
  range: number,
) => {
  const { start, end } = getRange(visibleIndex, range)

  return list.slice(start, end)
}

export const isLastIndex = <T>(
  list: T[],
  visibleIndex: number,
  range: number,
) => {
  const { end } = getRange(visibleIndex, range)

  return end >= list.length
}
