<script setup lang="ts">
import { ViewInfo } from '@model/view'
import TransactionType from '@/components/TransactionType.vue'

const props = defineProps<{
  item: ViewInfo
  rowClasses: object
  justifyClass: string
}>()
</script>

<template>
  <b-row :class="rowClasses">
    <b-col class="mb-50">
      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="font-weight-bolder d-flex align-items-start" :class="justifyClass">
      <transaction-type :type="item.value" />
    </b-col>
  </b-row>
</template>
