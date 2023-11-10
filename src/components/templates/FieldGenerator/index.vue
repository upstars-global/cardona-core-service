<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { FieldInfo, FieldType } from '../../../@model/field'
import { BaseField } from '../../../@model/templates/baseField'
import { IconsList } from '../../../@model/enums/icons'
import store from "@/store";

const props = withDefaults(defineProps<{
          modelValue: FieldInfo | BaseField
          options?: Array<any>
          withLabel?: boolean
          withInfo?: boolean
          disabled?: boolean
          size?: string // TODO: refactor sizes
        }>(),
        {
          withLabel: true,
          withInfo: true,
        })


const emits = defineEmits<{
  (e: 'search', search: string): void
  (e: 'update:modelValue', item: FieldInfo<any>): void
}>()

const canView = computed<boolean>(() =>
  props.modelValue.permission ? store.getters.abilityCan(props.modelValue.permission, 'view') : true,
)

const checkFields: Array<string> = [
  FieldType.Check,
  FieldType.Switch,
  FieldType.SwitchWithState,
]

const isCheckType = computed(
  () => props.modelValue instanceof FieldInfo && checkFields.includes(props.modelValue.type),
)

const groupLabel = computed(() =>
  props.withLabel && !isCheckType.value ? props.modelValue.label : '',
)

const formGroupClasses = computed(() => ({
  'form-required':
      props.withLabel && props.modelValue?.validationRules?.includes('required') && groupLabel.value,
}))

const fieldModel = computed({
  get: () => props.modelValue.value,
  set: value => {
    if (props.modelValue instanceof BaseField) {
      // eslint-disable-next-line vue/no-mutating-props
      props.modelValue.value = value
    }
    else { emits('update:modelValue', new FieldInfo<any>({ ...props.modelValue, value })) }
  },
})

const localValue = shallowRef(props.modelValue instanceof BaseField ? props.modelValue.component : `${props.modelValue.type}-field`)

const onSearch = (search: string) => emits('search', search)
</script>

<template>
  <div
    v-if="canView"
    :id="`${modelValue.key}-field`"
    class="mb-0"
    :class="formGroupClasses"
  >
    <VLabel
      :for="modelValue.key"
      class="mb-1 text-body-2 text-high-emphasis"
    >
      <span>
        {{ groupLabel }}
      </span>
      <VIcon
        v-if="withInfo && modelValue.info"
        :icon="IconsList.InfoIcon"
        class="text-muted ml-25 align-text-top"
      />
    </VLabel>

    <div>
      <Component
        :is="localValue"
        :id="modelValue.key"
        v-model="fieldModel"
        :options="options"
        :field="modelValue"
        :disabled="disabled"
        :placeholder="modelValue.placeholder"
        :size="size"
        v-bind="$attrs"
        @search="onSearch"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.check-description {
  font-size: 0.75rem;
  padding-left: 1.8rem;
}
</style>
