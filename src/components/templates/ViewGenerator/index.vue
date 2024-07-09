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
    class="field-generator"
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

        <label class="mb-0 label p-0 font-weight-regular view-generator__text">{{ modelValue.label }}</label>
      </VCol>
      <VCol
        :cols="valueColsCount"
        class="view-generator__text value font-weight-medium d-flex align-items-start text-break wrapper-value text-base ma-0 py-1"
        :class="justifyClass"
      >
        <slot :name="`sidebar-value(${keyName})`">
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
  color: rgba(var(--v-theme-grey-900), var(--v-body-opacity));
}
.wrapper-value {
  width: 100%;
}
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}

.view-generator__text {
  color: rgb(var(--v-theme-body));
}
</style>
