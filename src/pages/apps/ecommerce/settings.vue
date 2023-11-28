<script setup lang="ts">
import SettingsCheckout from '@/views/apps/ecommerce/settings/SettingsCheckout.vue'
import SettingsLocations from '@/views/apps/ecommerce/settings/SettingsLocations.vue'
import SettingsNotifications from '@/views/apps/ecommerce/settings/SettingsNotifications.vue'
import SettingsPayment from '@/views/apps/ecommerce/settings/SettingsPayment.vue'
import SettingsShippingAndDelivery from '@/views/apps/ecommerce/settings/SettingsShippingAndDelivery.vue'
import SettingsStoreDetails from '@/views/apps/ecommerce/settings/SettingsStoreDetails.vue'

const tabsData = [
  { icon: 'tabler-building-store', title: 'Store Details' },
  { icon: 'tabler-credit-card', title: 'Payments' },
  { icon: 'tabler-shopping-cart', title: 'Checkout' },
  { icon: 'tabler-discount-2', title: 'Shipping & Delivery' },
  { icon: 'tabler-map-pin', title: 'Location' },
  { icon: 'tabler-bell-ringing', title: 'Notifications' },
]

const activeTab = ref(null)
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="4"
    >
      <h6 class="text-h6 mb-4">
        Getting Started
      </h6>

      <VTabs
        v-model="activeTab"
        direction="vertical"
        class="v-tabs-pill disable-tab-transition"
      >
        <VTab
          v-for="(tabItem, index) in tabsData"
          :key="index"
          :prepend-icon="tabItem.icon"
        >
          {{ tabItem.title }}
        </VTab>
      </VTabs>
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <VWindow
        v-model="activeTab"
        class="disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <SettingsStoreDetails />
        </VWindowItem>

        <VWindowItem>
          <SettingsPayment />
        </VWindowItem>

        <VWindowItem>
          <SettingsCheckout />
        </VWindowItem>

        <VWindowItem>
          <SettingsShippingAndDelivery />
        </VWindowItem>

        <VWindowItem>
          <SettingsLocations />
        </VWindowItem>

        <VWindowItem>
          <SettingsNotifications />
        </VWindowItem>
      </VWindow>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.my-class {
  padding: 1.25rem;
  border-radius: 0.375rem;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}
</style>
