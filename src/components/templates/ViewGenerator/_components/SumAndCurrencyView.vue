<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import SumAndCurrency from '../../../../components/SumAndCurrency.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <sum-and-currency :data="item.value" />
</template>

