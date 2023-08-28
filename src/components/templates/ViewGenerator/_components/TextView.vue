<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <span class="mb-0">{{ item.value }}</span>
</template>
