<script setup lang="ts">
import { ViewInfo } from '../../../../@model/view'

const props = defineProps<{
  item: ViewInfo
}>()
</script>

<template>
  <div>
    <div
      v-for="(value, name) in item.value"
      :key="name"
      class="font-weight-bolder d-flex align-items-start"
    >
      {{ `${name}: ${value}` }}
    </div>
  </div>
</template>


