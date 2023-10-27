<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    listBadges?: any[]
    countItemShowBadge?: number
  }>(),
  {
    countItemShowBadge: 2,
  },
)

const isShowBadgeCount = computed(() => (props.listBadges?.length || 0) - (props.countItemShowBadge || 0) > 0)

const showListBadges = computed(() =>
  (props.listBadges?.length || 0) > (props.countItemShowBadge || 0)
    ? props.listBadges?.slice(0, props.countItemShowBadge)
    : props.listBadges,
)
</script>

<template>
  <div class="tags-list">
    <VChip
      v-for="(value, index) in showListBadges"
      :key="index"
      label
      color="secondary"
    >
      {{ value.name }}
      <span v-if="value?.position">({{ value.position }})</span>
    </VChip>
    <VChip
      v-if="isShowBadgeCount"
      label
      color="primary"
    >
      +{{ listBadges.length - countItemShowBadge }}
    </VChip>
  </div>
</template>

<style lang="scss">
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
</style>
