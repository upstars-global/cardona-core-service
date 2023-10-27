<script setup lang="ts">
import type { IBaseDatePeriod } from '../../../../@model/date'
import DateField from './DateField.vue'

defineProps<{
  period: IBaseDatePeriod
}>()
</script>

<template>
  <div class="d-flex flex-column pr-1">
    <DateField :date="period.dateFrom" />
    <DateField :date="period.dateTo" />
  </div>
</template>
