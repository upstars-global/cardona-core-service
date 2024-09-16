<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../store'
import type { ViewInfo, ViewJustifyContent } from '../../../@model/view'

const props = defineProps<{
  modelValue: ViewInfo
  keyName?: string
  justifyContent?: ViewJustifyContent
  cols?: number
}>()

const canView = computed<boolean>(() =>
  props.modelValue?.permission ? store.getters.abilityCan(props.modelValue?.permission, 'view') : true,
)

const justifyClass = computed(() => `justify-content-${props.justifyContent}`)
const valueColsCount = computed(() => 12 - props.cols)
</script>

<template>
  <div
    v-if="canView"
    class="view-generator py-1"
  >
    <VRow
      class="font-small-3"
      no-gutters
    >
      <VCol
        :cols="cols"
        class="wrapper-label"
      >
        <div
          v-if="modelValue.icon !== undefined"
          class="icon-block"
        >
          <VIcon :icon="modelValue.icon" />
        </div>

        <label class="mb-0 label p-0 text-body-1">{{ modelValue.label }}</label>
      </VCol>
      <VCol
        :cols="valueColsCount"
        class="value font-weight-medium d-flex align-items-start text-break wrapper-value font-weight-medium ma-0"
        :class="justifyClass"
      >
        <slot
          :name="`sidebar-value(${keyName})`"
          :value="modelValue.value"
        >
          <Component
            :is="modelValue.type"
            :item="modelValue"
            class="label-view"
          />
        </slot>
      </VCol>
    </VRow>
    <hr v-if="modelValue.withSeparator">
  </div>
</template>

<style lang="scss" scoped>
.wrapper-label {
  width: 100%;
  max-width: 154px;
}
.wrapper-value {
  width: 100%;
}
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>
