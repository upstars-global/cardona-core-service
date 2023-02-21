<script setup lang="ts">
import { ViewInfo } from '@model/view'
import BadgeCopy from '@/components/BadgeCopy.vue'

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
      <badge-copy :value="item.value" :is-view-label="false" />
    </b-col>
  </b-row>
</template>

