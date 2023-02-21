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
      <div v-if="item.icon !== undefined" class="icon-block">
        <feather-icon v-if="item.icon" :icon="item.icon" />
      </div>

      <span>
        {{ item.label }}
      </span>
    </b-col>

    <b-col class="font-weight-bolder d-flex align-items-start text-break" :class="justifyClass">
      {{ item.value }}
    </b-col>
  </b-row>
</template>


<style lang="scss" scoped>
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>

