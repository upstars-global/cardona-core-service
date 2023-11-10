<script setup lang="ts">
import type { StatusWithDateValue } from '../../../@model/view'
import StatusField from './StatusField.vue'
import DateField from './DateField.vue'

defineProps<{
  item: StatusWithDateValue
}>()
</script>

<template>
  <div class="status-with-date">
    <StatusField
      :value="item.status"
      class="mb-1"
    />

    <DateField
      :date="item.updatedAt"
      class="date-field"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "src/styles/styles";

.status-with-date {
  display: flex;
  flex-direction: column;
  align-items: start;
  .date-field {
    opacity: $opacity-text;
  }
}
</style>
