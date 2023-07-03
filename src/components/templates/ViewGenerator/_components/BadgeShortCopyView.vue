<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import BadgeCopy from '../../../../components/BadgeCopy.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <badge-copy class="copy-badge" :value="item.value" :is-view-label="false" is-short />
</template>

<style lang="scss" scoped>
.copy-badge {
  font-size: 0.9rem;
  font-weight: 600;
}
</style>