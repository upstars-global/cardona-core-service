<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import TransactionType from '../../_components/TransactionType.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <TransactionType :type="item.value" />
</template>
