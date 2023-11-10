<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import SumAndCurrency from '../../_components/SumAndCurrency.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
 <div>
   <SumAndCurrency :data="item.value" />
 </div>
</template>
