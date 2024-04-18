<script lang="ts">
import { defineComponent } from 'vue'
import { IconsList } from '../../@model/enums/icons'

export default defineComponent({
  name: 'SkeletonGrid',
  props: {
    number: {
      type: Number,
      default: 12,
    },
  },
  setup() {
    return {
      IconsList,
    }
  },
})
</script>

<template>
  <div
    v-for="n in number"
    :key="`skeleton-${n}`"
    class="item-file d-flex justify-center align-center"
  >
    <VIcon
      :icon="IconsList.ImageIcon"
      size="18"
      class="icon-no-file mb-0"
    />
  </div>
</template>
