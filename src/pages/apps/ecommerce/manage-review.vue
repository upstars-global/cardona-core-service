<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const selectedStatus = ref('All')
const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Fetch Reviews
const { data: ReviewData, execute: fetchReviews } = await useApi<any>(createUrl('/apps/ecommerce/reviews', {
  query: {
    q: searchQuery,
    status: selectedStatus,
    page,
    itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const reviews = computed(() => ReviewData.value.reviews)
const totalReviews = computed(() => ReviewData.value.total)

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Delete Review
const deleteReview = async (id: number) => {
  await $api(`/apps/ecommerce/reviews/${id}`, {
    method: 'DELETE',
  })

  fetchReviews()
}

const reviewCardData = [
  { rating: 5, value: 124 },
  { rating: 4, value: 40 },
  { rating: 3, value: 12 },
  { rating: 2, value: 7 },
  { rating: 1, value: 2 },
]

// Data table Headers
const headers = [
  { title: 'Product', key: 'product' },
  { title: 'Reviewer', key: 'reviewer' },
  { title: 'Review', key: 'review', sortable: false },
  { title: 'Date', key: 'date' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false },
]

// Chart Configs
const labelColor = 'rgba(var(--v-theme-on-surface), var(--v-disabled-opacity))'

const config = {
  colorsLabel: {
    success: '#28c76f29',
  },
  colors: {
    success: '#28c76f',
  },
}

const reviewStatChartSeries = [
  {
    data: [20, 40, 60, 80, 100, 80, 60],
  },
]

const reviewStatChartConfig = {
  chart: {
    height: 160,
    width: 190,
    type: 'bar',
    toolbar: {
      show: false,
    },
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    padding: {
      top: -25,
      bottom: -12,
    },
  },
  colors: [config.colorsLabel.success, config.colorsLabel.success, config.colorsLabel.success, config.colorsLabel.success, config.colors.success, config.colorsLabel.success, config.colorsLabel.success],
  plotOptions: {
    bar: {
      barHeight: '75%',
      columnWidth: '40%',
      startingShape: 'rounded',
      endingShape: 'rounded',
      borderRadius: 5,
      distributed: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      style: {
        colors: labelColor,
        fontSize: '13px',
      },
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  responsive: [{
    breakpoint: 0,
    options: {
      chart: {
        width: '100%',
      },
      plotOptions: {
        bar: {
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1440,
    options: {
      chart: {
        height: 150,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1400,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 1200,
    options: {
      chart: {
        height: 130,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 992,
    chart: {
      height: 150,
      width: 190,
      toolbar: {
        show: !1,
      },
    },
    options: {
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 883,
    options: {
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 768,
    options: {
      chart: {
        height: 150,
        width: 190,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '40%',
        },
      },
    },
  }, {
    breakpoint: 576,
    options: {
      chart: {
        width: '100%',
        height: '200',
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '30% ',
        },
      },
    },
  }, {
    breakpoint: 420,
    options: {
      plotOptions: {
        chart: {
          width: '100%',
          height: '200',
          type: 'bar',
        },
        bar: {
          borderRadius: 3,
          columnWidth: '30%',
        },
      },
    },
  }],
}
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="6"
    >
      <!-- 👉 Total Review Card  -->
      <VCard>
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="6"
            >
              <div :class="$vuetify.display.smAndUp ? 'border-e' : 'border-b'">
                <div class="d-flex align-center gap-x-2">
                  <h2 class="text-h2 text-primary">
                    4.89
                  </h2>
                  <VIcon
                    icon="tabler-star-filled"
                    color="primary"
                    size="32"
                  />
                </div>
                <div class="my-2 text-body-1 font-weight-medium text-high-emphasis">
                  Total 187 reviews
                </div>
                <div class="mb-2">
                  All reviews are from genuine customers
                </div>
                <VChip
                  color="primary"
                  label
                  :class="$vuetify.display.smAndUp ? '' : 'mb-4'"
                >
                  +5 This week
                </VChip>
              </div>
            </VCol>

            <VCol
              cols="12"
              sm="6"
            >
              <div
                v-for="(review, index) in reviewCardData"
                :key="index"
                class="d-flex align-center gap-x-4 mb-2"
              >
                <div class="text-no-wrap text-sm">
                  {{ review.rating }} Star
                </div>
                <div class="w-100">
                  <VProgressLinear
                    color="primary"
                    height="8"
                    :model-value="(review.value / 185) * 100"
                    rounded
                  />
                </div>
                <div>{{ review.value }}</div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol
      cols="12"
      md="6"
    >
      <VCard>
        <VCardText>
          <VRow>
            <VCol
              cols="12"
              sm="5"
            >
              <div>
                <h4 class="text-h4 mb-2">
                  Reviews statistics
                </h4>
                <div class="mb-9">
                  <span class="me-2">12 New Reviews</span>
                  <VChip
                    color="success"
                    label
                  >
                    +8.4%
                  </VChip>
                </div>

                <div>
                  <div class="text-high-emphasis text-body-1 font-weight-medium mb-2">
                    <span class="text-success">87%</span> Positive Reviews
                  </div>
                  <div class="text-body-1 text-disabled">
                    Weekly Report
                  </div>
                </div>
              </div>
            </VCol>

            <VCol
              cols="12"
              sm="7"
            >
              <div class="d-flex justify-start justify-sm-end">
                <VueApexCharts
                  id="shipment-statistics"
                  type="bar"
                  height="160"
                  :options="reviewStatChartConfig"
                  :series="reviewStatChartSeries"
                />
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
        <VCardText>
          <div class="d-flex justify-space-between flex-wrap gap-6 ">
            <VTextField
              v-model="searchQuery"
              style="max-inline-size: 200px; min-inline-size: 200px;"
              placeholder="Search .."
              density="compact"
            />
            <div class="d-flex flex-row gap-4 align-center flex-wrap">
              <VSelect
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100]"
                style="inline-size: 6.25rem"
                density="compact"
              />
              <AppSelect
                v-model="selectedStatus"
                style="max-inline-size:6.25rem;min-inline-size: 6.25rem"
                density="compact"
                :items="[
                  { title: 'All', value: 'All' },
                  { title: 'Published', value: 'Published' },
                  { title: 'Pending', value: 'Pending' },
                ]"
              />
              <VBtn
                prepend-icon="tabler-download"
                variant="tonal"
                color="default"
              >
                Export
              </VBtn>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VDataTableServer
          v-model:items-per-page="itemsPerPage"
          v-model:page="page"
          :headers="headers"
          :items="reviews"
          show-select
          :items-length="totalReviews"
          class="text-no-wrap"
          @update:options="updateOptions"
        >
          <template #item.product="{ item }">
            <div class="d-flex gap-x-3 align-center">
              <VAvatar
                :image="item.productImage"
                :size="38"
                variant="tonal"
                rounded
              />
              <div class="d-flex flex-column">
                <span class="text-body-1 text-high-emphasis font-weight-medium">{{ item.product }}</span>
                <span class="text-sm text-disabled text-wrap clamp-text text-wrap clamp-text">{{ item.companyName }}</span>
              </div>
            </div>
          </template>

          <template #item.reviewer="{ item }">
            <div class="d-flex align-center gap-x-3">
              <VAvatar
                :image="item.avatar"
                size="38"
              />
              <div class="d-flex flex-column">
                <RouterLink
                  :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: 478426 } }"
                  class="font-weight-medium"
                >
                  {{ item.reviewer }}
                </RouterLink>
                <span class="text-disabled text-sm">{{ item.email }}</span>
              </div>
            </div>
          </template>

          <template #item.review="{ item }">
            <div class="my-3">
              <VRating
                readonly
                :model-value="item.review"
                density="compact"
                class="mb-1"
              />
              <h6 class="text-h6 mb-2">
                {{ item.head }}
              </h6>
              <p class="text-sm text-medium-emphasis text-wrap mb-0">
                {{ item.para }}
              </p>
            </div>
          </template>

          <template #item.date="{ item }">
            {{ new Date(item.date).toDateString() }}
          </template>

          <template #item.status="{ item }">
            <VChip
              :color="item.status === 'Published' ? 'success' : 'warning'"
              label
            >
              {{ item.status }}
            </VChip>
          </template>

          <template #item.actions="{ item }">
            <IconBtn>
              <VIcon icon="tabler-dots-vertical" />
              <VMenu activator="parent">
                <VList>
                  <VListItem
                    value="view"
                    :to="{ name: 'apps-ecommerce-order-details-id', params: { id: item.id } }"
                  >
                    View
                  </VListItem>
                  <VListItem
                    value="delete"
                    @click="deleteReview(item.id)"
                  >
                    Delete
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </template>

          <!-- pagination -->
          <template #bottom>
            <VDivider />

            <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
              <p class="text-sm text-disabled mb-0">
                {{ paginationMeta({ page, itemsPerPage }, totalReviews) }}
              </p>

              <VPagination
                v-model="page"
                :length="Math.ceil(totalReviews / itemsPerPage)"
                :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalReviews / itemsPerPage), 5)"
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
    </VCol>
  </VRow>
</template>
