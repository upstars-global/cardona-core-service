import { useOS } from './useOS'

const CUSTOM_SCROLL_CLASS = 'custom-scroll'
export function useCustomScroll() {
  const { isMacOS } = useOS()

  onMounted(() => {
    if (!isMacOS.value)
      document.querySelector('html').classList.add(CUSTOM_SCROLL_CLASS)
  })
}
