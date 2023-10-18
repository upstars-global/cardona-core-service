<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import BadgeCopy from '../../_components/BadgeCopy.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <BadgeCopy
    class="copy-badge"
    :value="item.value"
    :is-view-label="false"
    is-short
  />
</template>

<style lang="scss" scoped>
.copy-badge {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
