<script setup lang="ts">
import type { StatusWithDateValue } from '../../../../@model/view'
import StatusField from './StatusField.vue'
import DateField from './DateField.vue'

defineProps<{
  item: StatusWithDateValue
}>()
</script>

<template>
  <div class="status-with-date">
    <StatusField :value="item.status" />

    <DateField :date="item.updatedAt" />
  </div>
</template>

<style lang="scss" scoped>
.status-with-date {
  display: flex;
  flex-direction: column;
  align-items: end;
}
</style>
