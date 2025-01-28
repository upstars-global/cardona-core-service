import type { Ref } from 'vue'
import { nextTick } from 'vue'

export const useInfiniteScroll = (loadMoreCb: Function, loadRef: Ref<HTMLElement | undefined>) => {
  const infiniteScroll = async (entries: IntersectionObserverEntry[]) => {
    const [{ isIntersecting, target }] = entries

    if (isIntersecting) {
      const ul = (target as HTMLElement).offsetParent as HTMLElement
      const scrollTop = ul.scrollTop

      await loadMoreCb()
      await nextTick()
      ul.scrollTop = scrollTop
    }
  }

  const observer = new IntersectionObserver(infiniteScroll)

  const setupObserver = async () => {
    await nextTick()
    observer.observe(loadRef.value)
  }

  const abortObserver = () => {
    observer.disconnect()
  }

  return {
    setupObserver,
    abortObserver,
  }
}
