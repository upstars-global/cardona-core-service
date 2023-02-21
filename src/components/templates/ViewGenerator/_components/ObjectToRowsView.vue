<script setup lang="ts">
import { ViewInfo } from '@model/view'
import DateField from '@/components/templates/BaseList/_components/DateField.vue'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()
</script>

<template>
  <div>
    <div class="mb-50" :class="rowClasses">
      {{ item.label }}
    </div>

    <div
      v-for="(value, name) in item.value"
      :key="name"
      class="font-weight-bolder d-flex align-items-start"
    >
      {{ `${name}: ${value}` }}
    </div>
  </div>
</template>


