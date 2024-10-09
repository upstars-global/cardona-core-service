<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import DateField from '../../_components/DateField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <DateField
    :date="item.value.dateFrom"
    class="mr-1"
  />-<DateField
    :date="item.value.dateTo"
    class="ml-1"
  />
</template>
