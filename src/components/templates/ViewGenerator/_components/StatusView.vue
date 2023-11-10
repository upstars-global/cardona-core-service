<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import StatusField from '../../_components/StatusField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div>
    <StatusField :value="item.value" />
  </div>
</template>
