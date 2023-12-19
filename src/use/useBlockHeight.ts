import { ref, onMounted, onUnmounted, onUpdated, Ref } from 'vue'
import { Nullable } from '../@model'

export function useBlockHeight(selector: string): Ref<number> {
  const blockRef = ref<Nullable<Element>>(null)
  const blockHeight = ref<number>(0)

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        blockHeight.value = entry.target.clientHeight
      }
    },
    { threshold: 0.5 }
  )

  const updateBlockHeight = () => {
    if (blockRef.value) {
      blockHeight.value = blockRef.value.clientHeight
    }
  }

  onMounted(() => {
    blockRef.value = document.querySelector(selector)

    if (blockRef.value) {
      observer.observe(blockRef.value)
    }

    updateBlockHeight()
  })

  onUnmounted(() => {
    if (blockRef.value) {
      observer.unobserve(blockRef.value)
    }
  })

  onUpdated(updateBlockHeight)

  return blockHeight
}
