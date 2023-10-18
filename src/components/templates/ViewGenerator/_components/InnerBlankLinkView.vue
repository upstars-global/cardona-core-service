<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'
import InnerBlankLink from '../../_components/InnerBlankLink.vue'

defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <InnerBlankLink :value="item.value" />
</template>
