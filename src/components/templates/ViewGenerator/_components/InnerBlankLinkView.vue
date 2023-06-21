<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import InnerBlankLink from '../../../../components/templates/_components/InnerBlankLink.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <inner-blank-link :value="item.value" />
</template>


