<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import StatusWithDateField from '../../../../components/templates/BaseList/_components/StatusWithDateField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div class="status-history--wrapper">
    <status-with-date-field
      v-for="(data, index) in item.value"
      :key="index"
      :item="data"
      class="status-history justify-content-between"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';
.status-history--wrapper {
  :deep(.status-history) {
    background-color: red !important;
    flex-direction: row;
    font-weight: $font-weight-bolder;

    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    .badge {
      margin-right: 0.5rem;
    }
  }
}
</style>


