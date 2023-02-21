<template>
  <div>
    <b-badge
      v-for="(value, index) in showListBadges"
      :key="index"
      variant="light-secondary"
      class="mr-50 mb-50"
    >
      {{ value.name }}
    </b-badge>
    <b-badge v-if="isShowBadgeCount" variant="light-primary" class="mr-50 mb-50">
      +{{ listBadges.length - countItemShowBadge }}
    </b-badge>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'BadgesField',

  props: {
    listBadges: {
      type: Array,
      default: () => [],
    },
    countItemShowBadge: {
      type: Number,
      default: 2,
    },
  },

  setup(props) {
    const isShowBadgeCount = computed(() => props.listBadges.length - props.countItemShowBadge > 0)
    const showListBadges = computed(() =>
      props.listBadges.length > props.countItemShowBadge
        ? props.listBadges.slice(0, props.countItemShowBadge)
        : props.listBadges
    )
    return {
      isShowBadgeCount,
      showListBadges,
    }
  },
})
</script>
