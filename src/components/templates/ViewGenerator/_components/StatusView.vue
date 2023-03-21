<script setup lang="ts">
import { ViewInfo } from '@model/view'
import StatusField from '@/components/templates/BaseList/_components/StatusField.vue'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <status-field :status="item.value" />
</template>


