import { onMounted } from 'vue'

const CUSTOM_SCROLL_CLASS = 'custom-scroll'
export function useCustomScroll() {
  onMounted(() => {
    document.querySelector('html').classList.add(CUSTOM_SCROLL_CLASS)
  })
}
