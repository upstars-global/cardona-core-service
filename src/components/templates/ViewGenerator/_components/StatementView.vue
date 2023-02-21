<script setup lang="ts">
import { ViewInfo } from '@model/view'
import StatementField from '@/components/templates/BaseList/_components/StatementField.vue'

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
      <statement-field :state="item.value" />
    </b-col>
  </b-row>
</template>
