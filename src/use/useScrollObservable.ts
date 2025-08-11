import { type Ref, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Opts {
  target: Ref<HTMLElement | null>
  scrollableSelector?: string
  bottomThreshold?: number
}

export function useScrollObserver({ target, scrollableSelector = '', bottomThreshold = 1 }: Opts) {
  const top = ref(0)
  const scrollHeight = ref(0)
  const clientHeight = ref(0)
  const isTop = ref(true)
  const isBottom = ref(false)
  const direction = ref<'up' | 'down' | null>(null)
  const percentToTop = ref(0)
  const percentToBottom = ref(100)

  let lastScrollTop = 0
  let scrollEl: HTMLElement | null = null

  const getScrollable = () => {
    const root = target.value
    if (!root)
      return null

    return scrollableSelector ? (root.querySelector(scrollableSelector) as HTMLElement | null) : root
  }

  const handleScroll = (el: HTMLElement) => {
    const st = el.scrollTop
    const sh = el.scrollHeight
    const ch = el.clientHeight
    const max = Math.max(0, sh - ch)

    top.value = st
    scrollHeight.value = sh
    clientHeight.value = ch

    isTop.value = st <= 0
    isBottom.value = st >= max - bottomThreshold

    if (st > lastScrollTop)
      direction.value = 'down'
    else if (st < lastScrollTop)
      direction.value = 'up'
    else direction.value = null
    lastScrollTop = st

    const pct = max > 0 ? (st / max) * 100 : 0
    const clamped = Math.min(100, Math.max(0, pct))

    percentToTop.value = Math.round(clamped)
    percentToBottom.value = Math.round(100 - clamped)
  }

  const onScroll = () => {
    if (scrollEl)
      handleScroll(scrollEl)
  }

  const attach = () => {
    detach()
    scrollEl = getScrollable()
    if (scrollEl) {
      scrollEl.addEventListener('scroll', onScroll, { passive: true })

      handleScroll(scrollEl)
    }
  }

  const detach = () => {
    if (scrollEl) {
      scrollEl.removeEventListener('scroll', onScroll)
      scrollEl = null
    }
  }

  const reinitialize = () => {
    attach()
  }

  onMounted(attach)
  onBeforeUnmount(detach)

  watch(target, () => {
    queueMicrotask(attach)
  })

  return {
    top,
    scrollHeight,
    clientHeight,
    isTop,
    isBottom,
    direction,
    percentToTop,
    percentToBottom,
    reinitialize,
  }
}

export function useWindowScrollObserver(bottomThreshold = 1) {
  const top = ref(0)
  const scrollHeight = ref(0)
  const clientHeight = ref(0)
  const isTop = ref(true)
  const isBottom = ref(false)
  const direction = ref<'up' | 'down' | null>(null)
  const percentToTop = ref(0)
  const percentToBottom = ref(100)

  let lastScrollTop = 0

  const getEl = () =>
    (document.scrollingElement || document.documentElement) as HTMLElement

  const handle = () => {
    const el = getEl()
    const st = el.scrollTop
    const sh = el.scrollHeight
    const ch = el.clientHeight
    const max = Math.max(0, sh - ch)

    top.value = st
    scrollHeight.value = sh
    clientHeight.value = ch

    isTop.value = st <= 0
    isBottom.value = st >= max - bottomThreshold

    if (st > lastScrollTop)
      direction.value = 'down'
    else if (st < lastScrollTop)
      direction.value = 'up'
    else direction.value = null
    lastScrollTop = st

    const pct = max > 0 ? (st / max) * 100 : 0
    const clamped = Math.min(100, Math.max(0, pct))

    percentToTop.value = Math.round(clamped)
    percentToBottom.value = Math.round(100 - clamped)
  }

  const onScroll = () => handle()

  function scrollToPercent(
    percent: number,
    opts: { from?: 'top' | 'bottom'; smooth?: boolean } = {},
  ) {
    const el = getEl()
    const max = Math.max(0, el.scrollHeight - el.clientHeight)
    const p = Math.min(100, Math.max(0, percent))
    const from = opts.from ?? 'top'

    const target
      = from === 'bottom' ? max - (p / 100) * max : (p / 100) * max

    window.scrollTo({
      top: target,
      behavior: opts.smooth ? 'smooth' : 'auto',
    })
  }

  onMounted(() => {
    if (typeof window === 'undefined')
      return
    window.addEventListener('scroll', onScroll, { passive: true })
    handle()
  })

  onBeforeUnmount(() => {
    if (typeof window === 'undefined')
      return
    window.removeEventListener('scroll', onScroll)
  })

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
  }
}
export function getRange(index: number, range: number): [number, number] {
  const start = index * range
  const end = start + range

  return [start, end]
}

export const getOptimizedList = <T>(
  list: T[],
  visibleIndex: number,
  range: number,
) => {
  const [start, end] = getRange(visibleIndex, range)

  return list.slice(start, end)
}

export const isLastIndex = <T>(
  list: T[],
  visibleIndex: number,
  range: number,
) => {
  const end = getRange(visibleIndex, range).at(-1)

  return end >= list.length
}
