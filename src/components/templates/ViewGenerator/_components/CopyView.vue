<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import CopyField from '../../_components/CopyField.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <CopyField :value="item.value" />
</template>
