<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import SumPeriod from '../../_components/SumPeriod.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <SumPeriod :data="item.value" />
</template>
