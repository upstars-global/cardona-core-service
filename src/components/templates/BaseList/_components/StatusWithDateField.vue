<script setup lang="ts">
import { StatusWithDateValue } from '../../../../@model/view'
import StatusField from './StatusField.vue'
import DateField from './DateField.vue'

const props = defineProps<{
  item: StatusWithDateValue
}>()
</script>

<template>
  <div class="status-with-date">
    <status-field :value="item.status" />

    <date-field :date="item.updatedAt" />
  </div>
</template>

<style lang="scss" scoped>
.status-with-date {
  display: flex;
  flex-direction: column;
  align-items: end;
}
</style>

