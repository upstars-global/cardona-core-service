<script setup lang="ts">
import DateField from './DateField.vue'
import {IBaseDatePeriod} from "../../../../../@model/date";

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
