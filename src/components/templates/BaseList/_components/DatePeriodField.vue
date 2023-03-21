<template>
  <div class="d-flex flex-column pr-1">
    <date-field :date="period.dateFrom" />
    <date-field :date="period.dateTo" />
  </div>
</template>

<script setup lang="ts">
import DateField from './DateField.vue'
import { IBaseDatePeriod } from '@model/date'

const props = defineProps<{
  period: IBaseDatePeriod
}>()
</script>