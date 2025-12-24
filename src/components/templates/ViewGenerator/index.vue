<script setup lang="ts">
import { computed } from 'vue'
import type { ViewInfo, ViewJustifyContent } from '../../../@model/view'
import { IconsList } from '../../../@model/enums/icons'
import { copyToClipboard } from '../../../helpers/clipboard'
import { useUserStore } from '../../../stores/user'
import { PermissionLevel } from '../../../@model/permission'

const props = defineProps<{
  modelValue: ViewInfo
  keyName?: string
  justifyContent?: ViewJustifyContent
  cols?: number
}>()

const userStore = useUserStore()

const canView = computed<boolean>(() =>
  props.modelValue?.permission ? userStore.abilityCan(props.modelValue?.permission, PermissionLevel.view) : true,
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
      :data-test-id="`view-generator-row-${keyName}`"
    >
      <VCol
        :cols="cols"
        data-test-id="wrapper-label"
      >
        <div
          v-if="modelValue.icon !== undefined"
          class="icon-block"
        >
          <VIcon
            data-test-id="icon"
            :icon="modelValue.icon"
          />
        </div>

        <label
          class="mb-0 label p-0 text-body-1"
          data-test-id="label"
        >{{ modelValue.label }}</label>
      </VCol>
      <VCol
        :cols="valueColsCount"
        class="value font-weight-medium d-flex align-items-start text-break font-weight-medium ma-0"
        :class="justifyClass"
        data-test-id="wrapper-value"
      >
        <slot
          :name="`sidebar-value(${keyName})`"
          :value="modelValue.value"
        >
          <Component
            :is="modelValue.type"
            :item="modelValue"
            class="label-view"
            data-test-id="view-generator-component"
          >
            <template
              v-if="modelValue.withCopy"
              #copy-btn="{ value }"
            >
              <VIcon
                :icon="IconsList.CopyIcon"
                data-test-id="copy-view-icon"
                class="cursor-pointer ml-1 text-color-mute"
                size="16"
                @click.stop="copyToClipboard(value)"
              />
            </template>
          </Component>
        </slot>
      </VCol>
    </VRow>
    <hr
      v-if="modelValue.withSeparator"
      data-test-id="separator"
    >
  </div>
</template>

<style lang="scss" scoped>
.icon-block {
  display: inline-block;
  width: 1rem;
  margin-right: 0.5rem;
}
</style>
