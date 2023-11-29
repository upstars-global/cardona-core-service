<script setup lang="ts">
const coursesData = [
  { title: 'Videography Basic Design Course', views: '1.2k', icon: 'tabler-brand-zoom', color: 'primary' },
  { title: 'Basic Front-end Development Course', views: '834', icon: 'tabler-code', color: 'info' },
  { title: 'Basic Fundamentals of Photography', views: '3.7k', icon: 'tabler-camera', color: 'success' },
  { title: 'Advance Dribble Base Visual Design', views: '2.5k', icon: 'tabler-brand-dribbble', color: 'warning' },
  { title: 'Your First Singing Lesson', views: '948', icon: 'tabler-microphone', color: 'error' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Top Courses">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>

    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="(course, index) in coursesData"
          :key="index"
        >
          <template #prepend>
            <VAvatar
              rounded
              variant="tonal"
              :color="course.color"
            >
              <VIcon
                :icon="course.icon"
                size="24"
              />
            </VAvatar>
          </template>

          <VListItemTitle class="me-4">
            <div class="d-flex flex-column">
              <div class="font-weight-medium text-truncate">
                {{ course.title }}
              </div>
              <div>
                <VChip
                  variant="tonal"
                  color="secondary"
                  label
                >
                  {{ course.views }} Views
                </VChip>
              </div>
            </div>
          </VListItemTitle>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
