<script setup lang="ts">
interface Props {
  searchQuery: string
}

const props = defineProps<Props>()

// Data table options
const itemsPerPage = ref(6)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

const hideCompleted = ref(false)
const label = ref('All Courses')

const { data: coursesData } = await useApi<any>(createUrl('/apps/academy/courses', {
  query: {
    q: () => props.searchQuery,
    hideCompleted,
    label,
    itemsPerPage,
    page,
    sortBy,
    orderBy,
  },
}))

const courses = computed(() => coursesData.value.courses)
const totalCourse = computed(() => coursesData.value.total)

watch([hideCompleted, label], () => {
  page.value = 1
})

const resolveChipColor = (tags: string) => {
  if (tags === 'Web')
    return 'primary'
  if (tags === 'Art')
    return 'success'
  if (tags === 'UI/UX')
    return 'error'
  if (tags === 'Psychology')
    return 'warning'
  if (tags === 'Design')
    return 'info'
}
</script>

<template>
  <VCard class="mb-6">
    <VCardText>
      <!-- 👉 Header -->
      <div class="d-flex justify-space-between align-center flex-wrap gap-4 mb-6">
        <div>
          <h5 class="text-h5">
            My Courses
          </h5>
          <div class="text-body-1">
            Total 6 course you have purchased
          </div>
        </div>

        <div class="d-flex flex-wrap align-center gap-4">
          <VSelect
            v-model="label"
            :items="[
              { title: 'Web', value: 'web' },
              { title: 'Art', value: 'art' },
              { title: 'UI/UX', value: 'ui/ux' },
              { title: 'Psychology', value: 'psychology' },
              { title: 'Design', value: 'design' },
              { title: 'All Courses', value: 'All Courses' },
            ]"
            density="compact"
            style="min-inline-size: 250px;"
          />
          <VSwitch
            v-model="hideCompleted"
            label="Hide Completed"
          />
        </div>
      </div>

      <!-- 👉 Course List -->
      <div class="mb-6">
        <VRow>
          <template
            v-for="course in courses"
            :key="course.id"
          >
            <VCol
              cols="12"
              md="4"
              sm="6"
            >
              <VCard
                flat
                border
              >
                <div class="pa-2">
                  <VImg
                    :src="course.tutorImg"
                    class="cursor-pointer"
                    @click="() => $router.push({ name: 'apps-academy-course-details' })"
                  />
                </div>
                <VCardText>
                  <div class="d-flex justify-space-between align-center mb-4">
                    <VChip
                      variant="tonal"
                      :color="resolveChipColor(course.tags)"
                      label
                    >
                      {{ course.tags }}
                    </VChip>
                    <div class="d-flex">
                      <span class="text-body-1 font-weight-medium align-center">
                        {{ course.rating }}
                      </span>
                      <VIcon
                        icon="tabler-star-filled"
                        color="warning"
                        class="me-2"
                        size="20"
                      />
                      <span class="text-body-1 text-disabled font-weight-medium">({{ course.ratingCount }})</span>
                    </div>
                  </div>
                  <h5 class="text-h5 mb-1">
                    <RouterLink
                      :to="{ name: 'apps-academy-course-details' }"
                      class="course-title"
                    >
                      {{ course.courseTitle }}
                    </RouterLink>
                  </h5>
                  <p>
                    {{ course.desc }}
                  </p>
                  <div
                    v-if="course.completedTasks !== course.totalTasks"
                    class="d-flex align-center mb-4"
                  >
                    <VIcon
                      icon="tabler-clock"
                      size="20"
                      class="me-1"
                    />
                    <span class="text-body-1 my-auto"> {{ course.time }}</span>
                  </div>
                  <div
                    v-else
                    class="mb-2"
                  >
                    <VIcon
                      icon="tabler-checks"
                      color="success"
                      class="me-1"
                    />
                    <span class="text-success text-body-1">Completed</span>
                  </div>
                  <VProgressLinear
                    :model-value="(course.completedTasks / course.totalTasks) * 100"
                    rounded
                    color="primary"
                    height="8"
                    class="mb-6"
                  />
                  <div class="d-flex flex-wrap gap-4">
                    <VBtn
                      variant="tonal"
                      color="secondary"
                      class="flex-grow-1"
                      :to="{ name: 'apps-academy-course-details' }"
                    >
                      <template #prepend>
                        <VIcon
                          icon="tabler-rotate-clockwise-2"
                          class="flip-in-rtl"
                        />
                      </template>
                      Start Over
                    </VBtn>
                    <VBtn
                      v-if="course.completedTasks !== course.totalTasks"
                      variant="tonal"
                      class="flex-grow-1"
                      :to="{ name: 'apps-academy-course-details' }"
                    >
                      <template #append>
                        <VIcon
                          icon="tabler-arrow-right"
                          class="flip-in-rtl"
                        />
                      </template>
                      Continue
                    </VBtn>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </template>
        </VRow>
      </div>
      <VPagination
        v-model="page"
        :length="Math.ceil(totalCourse / itemsPerPage)"
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
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.course-title{
  &:not(:hover){
    color: rgba(var(--v-theme-on-surface), var(--v-text-high-emphasis))
  }
}
</style>
