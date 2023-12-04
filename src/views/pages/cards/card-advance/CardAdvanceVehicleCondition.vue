<script setup lang="ts">
const assignmentData = [
  { title: 'Incorrect Address', subtitle: 'all exceptions', color: 'success', progress: 83, badgeValue: '+10%' },
  { title: 'Good', subtitle: '24 vehicles', color: 'info', progress: 17, badgeValue: '8.1' },
  { title: 'Average', subtitle: '14 vehicles', color: 'primary', progress: 8, badgeValue: '-2.5%' },
  { title: 'Bad', subtitle: '8 vehicles', color: 'warning', progress: 6, badgeValue: '-3.4%' },
  { title: 'Not Working', subtitle: '4 vehicles', color: 'error', progress: 2, badgeValue: '+12.6%' },
]
</script>

<template>
  <VCard>
    <VCardItem title="Vehicle Condition">
      <template #append>
        <MoreBtn />
      </template>
    </VCardItem>
    <VCardText>
      <VList class="card-list">
        <VListItem
          v-for="assignment in assignmentData"
          :key="assignment.title"
        >
          <template #prepend>
            <VProgressCircular
              v-model="assignment.progress"
              :size="54"
              class="me-4"
              :color="assignment.color"
            >
              <span class="text-body-1 text-high-emphasis font-weight-medium">
                {{ assignment.progress }}%
              </span>
            </VProgressCircular>
          </template>
          <VListItemTitle
            class="font-weight-medium mb-2"
            :class="`text-${assignment.color}`"
          >
            {{ assignment.title }}
          </VListItemTitle>

          <VListItemSubtitle>{{ assignment.subtitle }}</VListItemSubtitle>
          <template #append>
            <VChip label>
              {{ assignment.badgeValue }}
            </VChip>
          </template>
        </VListItem>
      </VList>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list{
  --v-card-list-gap: 1.875rem;
}
</style>
