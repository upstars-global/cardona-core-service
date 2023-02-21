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
  <b-row :class="rowClasses">
    <b-col>
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="font-weight-bolder d-flex align-items-start" :class="justifyClass">
      <date-field :date="item.value" />
    </b-col>
  </b-row>
</template>


