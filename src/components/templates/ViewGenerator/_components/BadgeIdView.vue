<script setup lang="ts">
import { ViewInfo } from '@model/view'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()
</script>

<template>
  <b-row :class="rowClasses">
    <b-col>
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="d-flex align-items-start" :class="justifyClass">
      <b-badge variant="light-secondary">{{ `ID ${item.value}` }}</b-badge>
    </b-col>
  </b-row>
</template>


