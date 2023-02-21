<script setup lang="ts">
import { ViewInfo } from '@model/view'
import SumAndCurrency from '@/components/SumAndCurrency.vue'

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
      <sum-and-currency :data="item.value" />
    </b-col>
  </b-row>
</template>

