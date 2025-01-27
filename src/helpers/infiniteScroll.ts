import { nextTick } from 'vue'

export const useInfiniteScroll = (showLoadMore: boolean, loadMoreCb: Function, loadRef: HTMLElement) => {
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

  const reInitObserver = async () => {
    observer.disconnect()
    await nextTick()
    if (showLoadMore)
      observer.observe(loadRef)
  }

  return {
    setupObserver,
    abortObserver,
    reInitObserver,
  }
}
