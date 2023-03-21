<template>
  <layout-vertical-admin-section>
    <router-view />

    <template #navbar="{ toggleVerticalMenuActive }">
      <navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
    </template>
  </layout-vertical-admin-section>
</template>

<script>
import LayoutVerticalAdminSection from '@core/layouts/layout-vertical/LayoutVerticalAdminSection.vue'
import Navbar from '../components/Navbar.vue'

export default {
  components: {
    LayoutVerticalAdminSection,
    Navbar,
  },
  data() {
    return {}
  },
}
</script>
