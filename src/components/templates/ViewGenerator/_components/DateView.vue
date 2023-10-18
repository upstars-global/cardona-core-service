<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import DateField from '../../_components/DateField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <DateField :date="item.value" />
</template>
