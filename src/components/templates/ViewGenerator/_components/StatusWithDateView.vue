<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import StatusWithDateField from '../../../../components/templates/BaseList/_components/StatusWithDateField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <status-with-date-field :item="item.value" />
</template>


