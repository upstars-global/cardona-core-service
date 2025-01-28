import { nextTick } from 'vue'

export const useInfiniteScroll = (loadMoreCb: Function, loadRef: HTMLElement) => {
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
    observer.observe(loadRef)
  }

  const abortObserver = () => {
    observer.disconnect()
  }

  return {
    setupObserver,
    abortObserver,
  }
}
