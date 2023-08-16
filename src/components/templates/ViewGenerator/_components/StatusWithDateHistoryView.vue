<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import DateField from '../../BaseList/_components/DateField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div class="status-history--wrapper">
    <div v-for="(data, index) in item.value" :key="index">
      <div class="font-weight-bolder mb-25">{{ data.title }}</div>
      <date-field class="font-weight-light" :date="data.date" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';
.status-history--wrapper {
  :deep(.status-history) {
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


