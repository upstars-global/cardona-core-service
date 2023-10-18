<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import DateWithSecondsField from '../../_components/DateWithSecondsField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <DateWithSecondsField :date="item.value" />
</template>
