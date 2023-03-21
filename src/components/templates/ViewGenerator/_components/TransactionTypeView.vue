<script setup lang="ts">
import { ViewInfo } from '@model/view'
import TransactionType from '@/components/TransactionType.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <transaction-type :type="item.value" />
</template>
