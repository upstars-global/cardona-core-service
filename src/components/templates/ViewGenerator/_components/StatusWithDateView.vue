<script setup lang="ts">
import { ViewInfo } from '@model/view'
import StatusWithDateField from '@/components/templates/BaseList/_components/StatusWithDateField.vue'

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

    <b-col :class="justifyClass">
      <status-with-date-field :item="item.value" />
    </b-col>
  </b-row>
</template>


