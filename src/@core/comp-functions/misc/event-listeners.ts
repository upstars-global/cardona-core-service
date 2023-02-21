import { ref, onUnmounted } from 'vue'

export const useScrollListener = () => {
  const scrolledTo = ref<number | null>(null)

  const scrollHandler = () => {
    scrolledTo.value = window.scrollY
  }

  window.addEventListener('scroll', scrollHandler)
  onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler)
  })

  return {
    scrolledTo,
  }
}

export const _ = null
