<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const searchQuery = ref('')

const selectedStatus = ref()

// Data table options
const itemsPerPage = ref(6)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// 👉 headers
const headers = [
  { title: '#ID', key: 'id' },
  { title: 'Trending', key: 'trending', sortable: false },
  { title: 'Total', key: 'total' },
  { title: 'Balance', key: 'balance' },
  { title: 'Date', key: 'date' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Fetch Invoices
const { data: invoiceData, execute: fetchInvoices } = await useApi<any>(createUrl('/apps/invoice', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const invoices = computed(() => invoiceData.value.invoices)
const totalInvoices = computed(() => invoiceData.value.totalInvoices)

// 👉 Invoice balance variant resolver
const resolveInvoiceBalanceVariant = (balance: string | number, total: number) => {
  if (balance === total)
    return { status: 'Unpaid', chip: { color: 'error' } }

  if (balance === 0)
    return { status: 'Paid', chip: { color: 'success' } }

  return { status: balance, chip: { variant: 'text' } }
}

// 👉 Invoice status variant resolver
const resolveInvoiceStatusVariantAndIcon = (status: string) => {
  if (status === 'Partial Payment')
    return { variant: 'success', icon: 'tabler-circle-half-2' }
  if (status === 'Paid')
    return { variant: 'warning', icon: 'tabler-chart-pie' }
  if (status === 'Downloaded')
    return { variant: 'info', icon: 'tabler-arrow-down-circle' }
  if (status === 'Draft')
    return { variant: 'primary', icon: 'tabler-device-floppy' }
  if (status === 'Sent')
    return { variant: 'secondary', icon: 'tabler-circle-check' }
  if (status === 'Past Due')
    return { variant: 'error', icon: 'tabler-info-circle' }

  return { variant: 'secondary', icon: 'tabler-x' }
}

const computedMoreList = computed(() => {
  return (paramId: number) => ([
    { title: 'Download', value: 'download', prependIcon: 'tabler-download' },
    {
      title: 'Edit',
      value: 'edit',
      prependIcon: 'tabler-pencil',
      to: { name: 'apps-invoice-edit-id', params: { id: paramId } },
    },
    { title: 'Duplicate', value: 'duplicate', prependIcon: 'tabler-layers-intersect' },
  ])
})

// 👉 Delete Invoice
const deleteInvoice = async (id: number) => {
  await $api(`/apps/invoice/${id}`, { method: 'DELETE' }).catch(err => console.log(err))

  fetchInvoices()
}
</script>

<template>
  <VCard
    v-if="invoices"
    id="invoice-list"
  >
    <VCardText>
      <div class="d-flex justify-space-between flex-wrap gap-4">
        <div class="d-flex gap-4 align-center">
          <div>
            <AppSelect
              :model-value="itemsPerPage"
              :items="[
                { value: 6, title: '6' },
                { value: 10, title: '10' },
                { value: 25, title: '25' },
                { value: 50, title: '50' },
                { value: 100, title: '100' },
                { value: -1, title: 'All' },
              ]"
              @update:model-value="itemsPerPage = parseInt($event, 10)"
            />
          </div>
          <!-- 👉 Create invoice -->
          <VBtn
            prepend-icon="tabler-plus"
            :to="{ name: 'apps-invoice-add' }"
          >
            Create invoice
          </VBtn>
        </div>
        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div class="invoice-list-filter">
            <AppTextField
              v-model="searchQuery"
              placeholder="Search Invoice"
              density="compact"
            />
          </div>
          <!-- 👉 Select status -->
          <div class="invoice-list-filter">
            <AppSelect
              v-model="selectedStatus"
              placeholder="Select Status"
              clearable
              clear-icon="tabler-x"
              single-line
              :items="['Downloaded', 'Draft', 'Sent', 'Paid', 'Partial Payment', 'Past Due']"
            />
          </div>
        </div>
      </div>
    </VCardText>

    <VDivider />

    <!-- SECTION Datatable -->
    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items-length="totalInvoices"
      :headers="headers"
      :items="invoices"
      fixed-footer
      height="385"
      class="text-no-wrap flex-grow-1"
      @update:options="updateOptions"
    >
      <!-- Trending Header -->
      <template #column.trending>
        <VIcon
          size="22"
          icon="tabler-trending-up"
        />
      </template>

      <!-- id -->

      <template #item.id="{ item }">
        <RouterLink :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }">
          #{{ item.id }}
        </RouterLink>
      </template>

      <!-- trending -->
      <template #item.trending="{ item }">
        <VTooltip>
          <template #activator="{ props }">
            <VAvatar
              :size="30"
              v-bind="props"
              :color="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).variant"
              variant="tonal"
            >
              <VIcon
                :size="20"
                :icon="resolveInvoiceStatusVariantAndIcon(item.invoiceStatus).icon"
              />
            </VAvatar>
          </template>
          <p class="mb-0">
            {{ item.invoiceStatus }}
          </p>
          <p class="mb-0">
            Balance: {{ item.balance }}
          </p>
          <p class="mb-0">
            Due date: {{ item.dueDate }}
          </p>
        </VTooltip>
      </template>

      <!-- Total -->
      <template #item.total="{ item }">
        ${{ item.total }}
      </template>

      <!-- Date -->
      <template #item.date="{ item }">
        {{ item.issuedDate }}
      </template>

      <!-- Balance -->
      <template #item.balance="{ item }">
        <VChip
          v-if="typeof ((resolveInvoiceBalanceVariant(item.balance, item.total)).status) === 'string'"
          label
          :color="resolveInvoiceBalanceVariant(item.balance, item.total).chip.color"
        >
          {{ (resolveInvoiceBalanceVariant(item.balance, item.total)).status }}
        </VChip>
        <span
          v-else
          class="text-sm text-high-emphasis"
        >
          {{ Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status) > 0 ? `$${(resolveInvoiceBalanceVariant(item.balance, item.total)).status}` : `-$${Math.abs(Number((resolveInvoiceBalanceVariant(item.balance, item.total)).status))}` }}
        </span>
      </template>

      <!-- Actions -->
      <template #item.actions="{ item }">
        <IconBtn @click="deleteInvoice(item.id)">
          <VIcon icon="tabler-trash" />
        </IconBtn>

        <IconBtn :to="{ name: 'apps-invoice-preview-id', params: { id: item.id } }">
          <VIcon icon="tabler-eye" />
        </IconBtn>

        <MoreBtn
          color="default"
          :menu-list="computedMoreList(item.id)"
          item-props
        />
      </template>

      <!-- pagination -->

      <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-3 px-6 py-5">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, totalInvoices) }}
          </p>

          <VPagination
            v-model="page"
            class="invoice-app-pagination"
            :length="Math.ceil(totalInvoices / itemsPerPage)"
            :total-visible="$vuetify.display.xs ? 1 : 5"
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
    <!-- !SECTION -->
  </VCard>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-filter {
    inline-size: 12rem;
  }
}
</style>
