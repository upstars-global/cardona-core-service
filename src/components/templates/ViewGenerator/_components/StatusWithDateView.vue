<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import StatusWithDateField from '../../_components/StatusWithDateField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <StatusWithDateField :item="item.value" />
</template>
