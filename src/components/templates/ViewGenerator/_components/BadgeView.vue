<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <VChip variant="light-primary" data-test-id="badge-chip">
    {{ item.value }}
  </VChip>
</template>
