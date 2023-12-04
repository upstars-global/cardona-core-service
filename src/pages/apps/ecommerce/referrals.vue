<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const widgetData = [
  { title: 'Total Earning', value: '$24,983', icon: 'tabler-currency-dollar', color: 'primary' },
  { title: 'Unpaid Earning', value: '$8,647', icon: 'tabler-gift', color: 'success' },
  { title: 'Signups', value: '2,367', icon: 'tabler-user', color: 'error' },
  { title: 'Conversion Rate', value: '4.5%', icon: 'tabler-infinity', color: 'info' },
]

const stepsData = [
  { icon: 'custom-rocket', desc: 'Create & validate your referral link and get', value: '$50' },
  { icon: 'custom-userinfo', desc: 'For every new signup you get', value: '10%' },
  { icon: 'custom-paper', desc: 'Get other friends to generate link and get', value: '$100' },
]

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Data Table Headers
const headers = [
  { title: 'Users', key: 'users' },
  { title: 'Referred ID', key: 'referred-id' },
  { title: 'Status', key: 'status' },
  { title: 'Value', key: 'value' },
  { title: 'Earnings', key: 'earning' },
]

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

// Fetching Referral Data
const { data: referralData } = await useApi<any>(createUrl('/apps/ecommerce/referrals', {
  query: {
    page,
    itemsPerPage,
    sortBy,
    orderBy,
  },
}))

const referrals = computed(() => referralData.value.referrals)
const totalReferrals = computed(() => referralData.value.total)

const resolveStatus = (status: string) => {
  if (status === 'Rejected')
    return { text: 'Rejected', color: 'error' }
  if (status === 'Unpaid')
    return { text: 'Unpaid', color: 'warning' }
  if (status === 'Paid')
    return { text: 'Paid', color: 'success' }
}
</script>

<template>
  <div>
    <!-- 👉 Header -->
    <VRow class="match-height">
      <!-- 👉 Widgets -->
      <VCol
        v-for="(data, index) in widgetData"
        :key="index"
        cols="12"
        md="3"
        sm="6"
      >
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-center">
              <div class="d-flex flex-column">
                <h4 class="text-h4">
                  {{ data.value }}
                </h4>
                <span class="text-sm">{{ data.title }}</span>
              </div>
              <VAvatar
                size="42"
                variant="tonal"
                :color="data.color"
              >
                <VIcon
                  :icon="data.icon"
                  size="26"
                />
              </VAvatar>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Icon Steps -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardItem>
            <VCardTitle class="mb-1">
              How to use
            </VCardTitle>
            <VCardSubtitle>
              <span class="text-body-1">Integrate your referral code in 3 easy steps.</span>
            </VCardSubtitle>
          </VCardItem>
          <VCardText>
            <div class="d-flex flex-column flex-sm-row gap-6 justify-sm-space-between align-center pt-2">
              <div
                v-for="(step, index) in stepsData"
                :key="index"
                class="d-flex flex-column align-center gap-y-2"
                style="max-inline-size: 185px;"
              >
                <div class="icon-container">
                  <VIcon
                    :icon="step.icon"
                    color="primary"
                    size="36"
                  />
                </div>
                <span class="text-body-2 text-wrap text-center">
                  {{ step.desc }}
                </span>
                <h5 class="text-primary text-h5">
                  {{ step.value }}
                </h5>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Invite -->
      <VCol
        cols="12"
        md="6"
      >
        <VCard>
          <VCardText>
            <div class="mb-8">
              <h5 class="text-h5 mb-4">
                Invite your friends
              </h5>
              <div class="d-flex align-center flex-wrap gap-4 flex-wrap">
                <AppTextField
                  label="Enter friend’s email address and invite them"
                  placeholder="Email Addresss"
                  density="compact"
                />
                <VBtn class="align-self-end">
                  Submit
                </VBtn>
              </div>
            </div>

            <div>
              <h5 class="text-h5 mb-4">
                Share the referral link
              </h5>
              <div class="d-flex gap-4 align-center flex-wrap">
                <AppTextField
                  label="Share referral link in social media"
                  placeholder="pixinvent.com/?ref=6478"
                  density="compact"
                />
                <div class="d-flex align-self-end gap-x-4">
                  <VBtn
                    icon
                    class="rounded"
                    color="#3B5998"
                    size="40"
                  >
                    <VIcon
                      color="white"
                      icon="tabler-brand-facebook"
                    />
                  </VBtn>

                  <VBtn
                    icon
                    class="rounded"
                    color="#55ACEE"
                    size="40"
                  >
                    <VIcon
                      color="white"
                      icon="tabler-brand-twitter"
                    />
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <!-- 👉 Referral Table -->

      <VCol cols="12">
        <VCard>
          <VCardText>
            <div class="d-flex justify-space-between align-center flex-wrap gap-4">
              <h5 class="text-h5">
                Referred Users
              </h5>
              <div class="d-flex flex-wrap gap-4">
                <div class="d-flex gap-4 align-center flex-wrap">
                  <VSelect
                    v-model="itemsPerPage"
                    :items="[10, 25, 50, 100]"
                    style="inline-size: 100px;"
                    density="compact"
                  />
                  <VBtn
                    prepend-icon="tabler-screen-share"
                    color="default"
                    variant="tonal"
                  >
                    Export
                  </VBtn>
                </div>
              </div>
            </div>
          </VCardText>

          <VDivider />

          <VDataTableServer
            v-model:items-per-page="itemsPerPage"
            v-model:page="page"
            :items="referrals"
            :headers="headers"
            :items-length="totalReferrals"
            show-select
            @update:options="updateOptions"
          >
            <template #item.users="{ item }">
              <div class="d-flex align-center gap-x-3">
                <VAvatar
                  :image="item.avatar"
                  :size="38"
                />
                <div>
                  <div class="font-weight-medium text-high-emphasis">
                    <RouterLink :to="{ name: 'apps-ecommerce-customer-details-id', params: { id: 478426 } }">
                      {{ item.user }}
                    </RouterLink>
                  </div>
                  <div class="text-sm text-disabled">
                    {{ item.email }}
                  </div>
                </div>
              </div>
            </template>

            <template #item.referred-id="{ item }">
              {{ item.referredId }}
            </template>

            <template #item.status="{ item }">
              <VChip
                v-bind="resolveStatus(item.status)"
                label
              />
            </template>

            <template #item.earning="{ item }">
              <h6 class="text-h6">
                {{ item.earning }}
              </h6>
            </template>

            <!-- pagination -->
            <template #bottom>
              <VDivider />

              <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
                <p class="text-sm text-disabled mb-0">
                  {{ paginationMeta({ page, itemsPerPage }, totalReferrals) }}
                </p>

                <VPagination
                  v-model="page"
                  :length="Math.ceil(totalReferrals / itemsPerPage)"
                  :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalReferrals / itemsPerPage), 5)"
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
  </div>
</template>

<style lang="scss" scoped>
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 50%;
  block-size: 70px;
  inline-size: 70px;
}

.icon {
  color: #000;
  font-size: 42px;
}
</style>
