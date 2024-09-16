<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <span class="mb-0 text-color-base">{{ item.value }}</span>
</template>
