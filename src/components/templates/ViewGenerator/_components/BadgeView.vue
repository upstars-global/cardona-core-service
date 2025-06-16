<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import { VVariants } from '../../../../@model/vuetify'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <VChip
    :variant="VVariants.Tonal"
    data-test-id="badge-chip"
  >
    {{ item.value }}
  </VChip>
</template>
