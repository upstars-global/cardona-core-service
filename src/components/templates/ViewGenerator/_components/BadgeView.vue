<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <b-badge variant="light-primary">{{ item.value }}</b-badge>
</template>


