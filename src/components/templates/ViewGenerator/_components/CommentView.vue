<script setup lang="ts">
import { ViewInfo } from '@model/view'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
}>()
</script>

<template>
  <b-row :class="rowClasses" class="d-flex flex-column">
    <b-col class="mb-50">
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="font-weight-bolder text-break comment-view-text">
      {{ item.value ? item.value : '-' }}
    </b-col>
  </b-row>
</template>



