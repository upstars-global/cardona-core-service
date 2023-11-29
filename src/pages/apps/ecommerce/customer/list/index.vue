<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

import ECommerceAddCustomerDrawer from '@/views/apps/ecommerce/ECommerceAddCustomerDrawer.vue'

const searchQuery = ref('')
const isAddCustomerDrawerOpen = ref(false)

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Data table Headers
const headers = [
  { title: 'Customer', key: 'customer' },
  { title: 'Customer Id', key: 'customerId' },
  { title: 'Country', key: 'country' },
  { title: 'Orders', key: 'orders' },
  { title: 'Total Spent', key: 'totalSpent' },
]

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Fetch customers Data
const { data: customerData } = await useApi<any>(createUrl('/apps/ecommerce/customers',
  {
    query: {
      q: searchQuery,
      itemsPerPage,
      page,
      sortBy,
      orderBy,
    },
  }),
)

const customers = computed(() => customerData.value.customers)
const totalCustomers = computed(() => customerData.value.total)
</script>

<template>
  <div>
    <VCard>
      <VCardText>
        <div class="d-flex justify-space-between flex-wrap gap-y-4">
          <AppTextField
            v-model="searchQuery"
            style="max-inline-size: 200px; min-inline-size: 200px;"
            placeholder="Search .."
            density="compact"
          />
          <div class="d-flex flex-row gap-4 align-center flex-wrap">
            <AppSelect
              v-model="itemsPerPage"
              density="compact"
              :items="[5, 10, 20, 50, 100]"
            />

            <VBtn
              prepend-icon="tabler-screen-share"
              variant="tonal"
              color="secondary"
            >
              Export
            </VBtn>
            <VBtn
              prepend-icon="tabler-plus"
              @click="isAddCustomerDrawerOpen = !isAddCustomerDrawerOpen"
            >
              Add Customer
            </VBtn>
          </div>
        </div>
      </VCardText>

      <VDivider />
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="customers"
        :headers="headers"
        :items-length="totalCustomers"
        show-select
        class="text-no-wrap"
        @update:options="updateOptions"
      >
        <template #item.customer="{ item }">
          <div class="d-flex align-center gap-x-3">
            <VAvatar
              size="38"
              :image="item.avatar"
            />
            <div class="d-flex flex-column">
              <RouterLink
                :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: item.customerId } }"
                class="font-weight-medium"
              >
                {{ item.customer }}
              </RouterLink>
              <span class="text-sm text-disabled">{{ item.email }}</span>
            </div>
          </div>
        </template>

        <template #item.customerId="{ item }">
          <span class="font-weight-medium text-high-emphasis">#{{ item.customerId }}</span>
        </template>

        <template #item.orders="{ item }">
          {{ item.order }}
        </template>

        <template #item.country="{ item }">
          <div class="d-flex gap-x-2">
            <img
              :src="item.countryFlag"
              height="22"
              width="22"
            >
            <span class="text-body-1">{{ item.country }}</span>
          </div>
        </template>

        <template #item.totalSpent="{ item }">
          <span class="text-body-1 font-weight-medium text-high-emphasis">${{ item.totalSpent }}</span>
        </template>

        <template #bottom>
          <VDivider />

          <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
            <p class="text-sm text-disabled mb-0">
              {{ paginationMeta({ page, itemsPerPage }, totalCustomers) }}
            </p>

            <VPagination
              v-model="page"
              :length="Math.ceil(totalCustomers / itemsPerPage)"
              :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalCustomers / itemsPerPage), 5)"
            >
              <template #prev="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Previous
                </VBtn>
              </template>

              <template #next="slotProps">
                <VBtn
                  variant="tonal"
                  color="default"
                  v-bind="slotProps"
                  :icon="false"
                >
                  Next
                </VBtn>
              </template>
            </VPagination>
          </div>
        </template>
      </VDataTableServer>
    </VCard>

    <ECommerceAddCustomerDrawer v-model:is-drawer-open="isAddCustomerDrawerOpen" />
  </div>
</template>

<style lang="scss" scoped>
.customer-title:hover{
  color: rgba(var(--v-theme-primary)) !important;
}
</style>
