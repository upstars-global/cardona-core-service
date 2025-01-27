import { nextTick, ref } from 'vue'

export const useInfiniteScroll = (showLoadMore: boolean, loadMoreCb: Function) => {
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
  const loadRef = ref<HTMLElement | null>(null)

  const setupObserver = async () => {
    await nextTick()
    observer.observe(loadRef.value as HTMLElement)
  }

  const abortObserver = () => {
    observer.disconnect()
  }

  const reInitObserver = async () => {
    observer.disconnect()
    await nextTick()
    if (showLoadMore)
      observer.observe(loadRef.value as HTMLElement)
  }

  return {
    loadRef,
    setupObserver,
    abortObserver,
    reInitObserver,
  }
}
