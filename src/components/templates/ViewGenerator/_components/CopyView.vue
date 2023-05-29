<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'
import CopyField from '../../BaseList/_components/CopyField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <copy-field :value="item.value" />
</template>
