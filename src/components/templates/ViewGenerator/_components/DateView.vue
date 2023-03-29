<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import DateField from '../../../../components/templates/BaseList/_components/DateField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <date-field :date="item.value" />
</template>


