import { ref, onMounted, onUnmounted, Ref } from 'vue'

interface ResizeObserverResult {
  contentRect: {
    height: number
  }
  target: Element
}

interface UseResizeObserver {
  observedElement: Ref<null | Element>
  elementHeight: Ref<number>
}

export default function useResizeObserver(): UseResizeObserver {
  const observedElement = ref<null | Element>(null)
  const elementHeight = ref<number>(0)

  const resizeObserver = new ResizeObserver((entries: ResizeObserverResult[]) => {
    for (const entry of entries) {
      if (entry.target === observedElement.value) {
        elementHeight.value = entry.contentRect.height
      }
    }
  })

  onMounted(() => {
    if (observedElement.value) {
      resizeObserver.observe(observedElement.value)
    }
  })

  onUnmounted(() => {
    resizeObserver.disconnect()
  })

  return { observedElement, elementHeight }
}
