<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <VChip variant="light-primary">
    {{ item.value }}
  </VChip>
</template>
