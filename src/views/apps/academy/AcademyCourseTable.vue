<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import { paginationMeta } from '@api-utils/paginationMeta'

const searchQuery = ref('')

// Data table options
const itemsPerPage = ref(5)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'Course Name', key: 'courseName' },
  { title: 'Time', key: 'time', sortable: false },
  { title: 'Progress', key: 'progress' },
  { title: 'Status', key: 'status', sortable: false },
]

// Fetch course Data
const { data: courseData } = await useApi<any>(createUrl('/apps/academy/courses', {
  query: {
    q: searchQuery,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const courses = computed(() => courseData.value.courses)
const totalCourse = computed(() => courseData.value.total)
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex flex-wrap justify-space-between align-center gap-4">
        <h5 class="text-h5 font-weight-medium">
          Courses you are taking
        </h5>
        <div>
          <AppTextField
            v-model="searchQuery"
            placeholder="Search"
            style=" max-inline-size: 200px;min-inline-size: 200px;"
          />
        </div>
      </div>
    </VCardText>

    <VDataTableServer
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      :items-per-page-options="[
        { value: 5, title: '5' },
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: -1, title: '$vuetify.dataFooter.itemsPerPageAll' },
      ]"
      :headers="headers"
      :items="courses"
      :items-length="totalCourse"
      show-select
      class="text-no-wrap"
      @update:options="updateOptions"
    >
      <!-- Course Name -->
      <template #item.courseName="{ item }">
        <div class="d-flex align-center gap-x-4 py-2">
          <VAvatar
            variant="tonal"
            size="40"
            rounded
            :color="item.color"
          >
            <VIcon :icon="item.logo" />
          </VAvatar>

          <div>
            <div class="text-base font-weight-medium mb-1">
              <RouterLink
                :to="{ name: 'apps-academy-course-details' }"
                class="text-link"
              >
                {{ item.courseTitle }}
              </RouterLink>
            </div>
            <div class="d-flex align-center">
              <VAvatar
                size="22"
                :image="item.image"
              />
              <span class="text-base ms-2">
                {{ item.user }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <template #item.time="{ item }">
        <span class="text-base text-high-emphasis font-weight-medium">
          {{ item.time }}
        </span>
      </template>

      <!-- Progress -->
      <template #item.progress="{ item }">
        <div
          class="d-flex align-center gap-x-4 mb-2"
          style="inline-size: 15.625rem;"
        >
          <div class="text-no-wrap font-weight-medium text-high-emphasis">
            {{ Math.floor((item.completedTasks / item.totalTasks) * 100) }}%
          </div>
          <div class="w-100">
            <VProgressLinear
              color="primary"
              height="8"
              :model-value="Math.floor((item.completedTasks / item.totalTasks) * 100)"
              rounded
            />
          </div>
          <div class="text-disabled">
            {{ item.completedTasks }}/{{ item.totalTasks }}
          </div>
        </div>
      </template>

      <!-- Status -->
      <template #item.status="{ item }">
        <div class="d-flex justify-space-between gap-x-4">
          <div>
            <VIcon
              icon="tabler-users"
              color="primary"
              size="24"
              class="me-2"
            />
            <span class="text-body-1">
              {{ item.userCount }}
            </span>
          </div>
          <div>
            <VIcon
              icon="tabler-book"
              color="info"
              size="24"
              class="me-2"
            />
            <span class="text-body-1">{{ item.note }}</span>
          </div>
          <div>
            <VIcon
              icon="tabler-brand-zoom"
              color="error"
              size="24"
              class="me-2"
            />
            <span class="text-body-1">{{ item.view }}</span>
          </div>
        </div>
      </template>

      <!-- Pagination -->
      <template #bottom>
        <VDivider />

        <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
          <p class="text-sm text-disabled mb-0">
            {{ paginationMeta({ page, itemsPerPage }, totalCourse) }}
          </p>

          <VPagination
            v-model="page"
            :length="Math.ceil(totalCourse / itemsPerPage)"
            :total-visible="$vuetify.display.xs ? 1 : Math.min(Math.ceil(totalCourse / itemsPerPage), 5)"
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
</template>
