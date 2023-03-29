<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import StatementField from '../../../../components/templates/BaseList/_components/StatementField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <statement-field :state="item.value" />
</template>
