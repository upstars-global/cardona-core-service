<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import DateField from '../../_components/DateField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div class="status-history--wrapper">
    <div
      v-for="(data, index) in item.value"
      :key="index"
      class="status-history--wrapper__item"
    >
      <div class="mb-1">
        <span class="mb-1 font-normal-1">
          {{ data.title }}
        </span>
      </div>
      <DateField
        class="date-field font-weight-light"
        :date="data.date"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-history--wrapper {
    &__item {
      &:not(:last-child) {
        margin-bottom: .5rem;
      }
    }
    .date-field {
      font-size: 15px;
    }
  }
</style>
