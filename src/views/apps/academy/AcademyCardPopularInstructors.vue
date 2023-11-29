<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
</script>

<template>
  <VCard>
    <VCardItem title="Popular Instructors">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>
    <VDivider />
    <div class="text-overline d-flex justify-space-between px-5">
      <span>instructors</span>
      <span>Courses</span>
    </div>
    <VDivider />
    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="instructor in [
            { name: 'Jordan Stevenson', profession: 'Business Intelligence', totalCourses: 33, avatar: avatar1 },
            { name: 'Bentlee Emblin', profession: 'Digital Marketing', totalCourses: 52, avatar: avatar2 },
            { name: 'Benedetto Rossiter', profession: 'UI/UX Design', totalCourses: 12, avatar: avatar3 },
            { name: 'Beverlie Krabbe', profession: 'Vue', totalCourses: 8, avatar: avatar4 },
          ]"
          :key="instructor.name"
        >
          <template #prepend>
            <VAvatar
              size="34"
              :image="instructor.avatar"
            />
          </template>
          <VListItemTitle class="font-weight-medium">
            {{ instructor.name }}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            {{ instructor.profession }}
          </VListItemSubtitle>

          <template #append>
            <span class="text-body-1 text-high-emphasis">
              {{ instructor.totalCourses }}
            </span>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>
