<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import SumPeriod from '../../_components/SumPeriod.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <sum-period :data="item.value" />
</template>
