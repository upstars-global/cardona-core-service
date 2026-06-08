import type { Ref } from 'vue'
import { nextTick } from 'vue'

export const useInfiniteScroll = (loadMoreCb: Function, loadRef: Ref<HTMLElement | undefined>) => {
  let isLoading = false

  const infiniteScroll = async (entries: IntersectionObserverEntry[]) => {
    const [{ isIntersecting, target }] = entries

    if (isIntersecting && !isLoading) {
      isLoading = true
      const ul = (target as HTMLElement).offsetParent as HTMLElement
      const scrollTop = ul.scrollTop

      try {
        await loadMoreCb()
        await nextTick()
        requestAnimationFrame(() => {
          ul.scrollTop = scrollTop
          isLoading = false
        })
      }
      catch {
        isLoading = false
      }
    }
  }

  const observer = new IntersectionObserver(infiniteScroll)

  const setupObserver = async () => {
    await nextTick()
    if (loadRef.value instanceof Element) observer.observe(loadRef.value)
  }

  const abortObserver = () => {
    observer.disconnect()
  }

  return {
    setupObserver,
    abortObserver,
  }
}
