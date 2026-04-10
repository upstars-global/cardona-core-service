<script setup lang="ts">
import type { ViewInfo } from '../../../../@model/view'

defineProps<{
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
      <slot
        :key="name"
        :name
        :value="value"
      >
        {{ `${name}: ${value}` }}
      </slot>
    </div>
  </div>
</template>
