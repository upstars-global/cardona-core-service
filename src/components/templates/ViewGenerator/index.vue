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
  props.modelValue.permission ? store.getters.abilityCan(props.modelValue.permission, 'view') : true,
)

const justifyClass = computed(() => `justify-content-${props.justifyContent}`)
const valueColsCount = computed(() => 12 - props.cols)
</script>

<template>
  <div v-if="canView">
    <VRow class="font-small-3">
      <VCol :cols="cols">
        <div
          v-if="value.icon !== undefined"
          class="icon-block"
        >
          <VIcon
            v-if="value.icon"
            :icon="value.icon"
          />
        </div>

        <label class="mb-0">{{ modelValue.label }}</label>
      </VCol>
      <VCol
        :cols="valueColsCount"
        class="font-weight-bolder d-flex align-items-start text-break"
        :class="justifyClass"
      >
        <slot :name="`sidebar-value(${keyName})`">
          <Component
            :is="value.type"
            :item="value"
          />
        </slot>
      </VCol>
    </VRow>
    <hr v-if="value.withSeparator">
  </div>
</template>

<style lang="scss" scoped>
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>
