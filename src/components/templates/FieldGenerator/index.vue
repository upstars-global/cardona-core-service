<script setup lang="ts">
import { computed } from 'vue'
import { Field } from 'vee-validate'
import type { BaseField } from '../../../@model/templates/baseField'
import { CheckBaseField, SwitchBaseField } from '../../../@model/templates/baseField'
import store from '../../../store'
import { IconsList } from '../../../@model/enums/icons'

const props = withDefaults(defineProps<{
  modelValue: BaseField
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
  (e: 'update:modelValue', item: BaseField): void
}>()

const canView = computed<boolean>(() => {
  return props.modelValue?.permission ? store.getters.abilityCan(props.modelValue.permission, 'view') : true
},
)

const isCheckType = computed(
  () => props.modelValue instanceof SwitchBaseField || props.modelValue instanceof CheckBaseField,
)

const groupLabel = computed(() =>
  props.withLabel && !isCheckType.value ? props.modelValue.label : '',
)

const formGroupClasses = computed(() => ({
  'form-required':
      props.withLabel && props.modelValue?.validationRules?.required && groupLabel.value,
}))

const fieldModel = computed({
  get: () => props.modelValue.value,
  set: value => {
    props.modelValue.value = value
    emits('update:modelValue', props.modelValue)
  },
})

const localValue = computed(() => props.modelValue.component)

const onSearch = (search: string) => emits('search', search)
</script>

<template>
  <div
    v-if="canView"
    :id="`${modelValue?.key}-field`"
    class="mb-0 field-generator"
    :class="formGroupClasses"
  >
    <VLabel
      v-if="groupLabel"
      :for="modelValue?.key"
      class="mb-1 field-generator-label text-body-2 text-high-emphasis justify-between"
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

    <Field
      v-model="fieldModel"
      :name="modelValue.id"
      :label="modelValue.label"
      :rules="modelValue.validationRules"
      :validate-on-blur="false"
      :validate-on-change="false"
      :validate-on-input="false"
      :validate-on-model-update="false"
    >
      <template #default="{ errorMessage }">
        <Component
          :is="localValue"
          :id="modelValue.id"
          v-model="fieldModel"
          :options="options"
          :field="modelValue"
          :disabled="disabled"
          :placeholder="modelValue.placeholder"
          :size="size"
          v-bind="{ ...$attrs }"
          :errors="!!errorMessage"
          @search="onSearch"
        />
        <span class="text-caption text-error mt-1">{{ errorMessage }}</span>
      </template>
    </Field>
  </div>
</template>

<style lang="scss" scoped>
.field-generator {
  .form-required &-label:after {
    content: "*";
    color: rgb(var(--v-theme-error));
    margin-left: 0.25rem;
  }
}
.check-description {
  font-size: 0.75rem;
  padding-left: 1.8rem;
}
</style>
