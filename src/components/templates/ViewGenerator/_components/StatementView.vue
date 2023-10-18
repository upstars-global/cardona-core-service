<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import StatementField from '../../_components/StatementField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <StatementField :state="item.value" />
</template>
