import type { ComputedRef } from 'vue'
import { computed, onMounted, ref } from 'vue'
import OperatingSystem from '../@model/enums/systemsOS'

interface UseOS {
  operationSystem: ComputedRef<OperatingSystem>
  isWindow: ComputedRef<boolean>
  isLinux: ComputedRef<boolean>
  isMacOS: ComputedRef<boolean>
}

export function useOS(): UseOS {
  const os = ref(OperatingSystem.Unknown)

  onMounted(() => {
    const userAgent = window.navigator.userAgent
    const platform = window.navigator.platform
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
    const iosPlatforms = ['iPhone', 'iPad', 'iPod']

    if (macosPlatforms.includes(platform))
      os.value = OperatingSystem.MacOS
    else if (iosPlatforms.includes(platform))
      os.value = OperatingSystem.IOS
    else if (windowsPlatforms.includes(platform))
      os.value = OperatingSystem.Windows
    else if (/Android/.test(userAgent))
      os.value = OperatingSystem.Android
    else if (!os.value && /Linux/.test(platform))
      os.value = OperatingSystem.Android
  })

  const operationSystem = computed(() => os.value)
  const isWindow = computed((): boolean => os.value === OperatingSystem.Windows)
  const isLinux = computed((): boolean => os.value === OperatingSystem.Linux)
  const isMacOS = computed((): boolean => os.value === OperatingSystem.MacOS)

  return {
    operationSystem,
    isWindow,
    isLinux,
    isMacOS,
  }
}
