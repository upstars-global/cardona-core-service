<template>
  <b-nav-item @click="skin = isDark ? 'light' : 'dark'">
    <feather-icon size="21" :icon="icon" />
  </b-nav-item>
</template>

<script>
import useAppConfig from '../../../../../@core/app-config/useAppConfig'
import { computed } from 'vue'
import { BNavItem } from 'bootstrap-vue'
import { IconsList } from '../../../../../@model/enums/icons'

export default {
  components: {
    BNavItem,
  },
  setup() {
    const { skin } = useAppConfig()

    const isDark = computed(() => skin.value === 'dark')
    const icon = computed(() => (isDark.value ? IconsList.SunIcon : IconsList.MoonIcon))
    return { skin, isDark, icon }
  },
}
</script>
