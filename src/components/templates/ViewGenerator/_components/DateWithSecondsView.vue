<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import DateWithSecondsField from '../../../../components/templates/BaseList/_components/DateWithSecondsField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <date-with-seconds-field :date="item.value" />
</template>


