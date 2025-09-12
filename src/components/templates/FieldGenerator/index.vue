<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { Field } from 'vee-validate'
import type { BaseField } from '../../../@model/templates/baseField'
import { CheckBaseField, FieldGeneratorSlots, RatesBaseField, SwitchBaseField } from '../../../@model/templates/baseField'
import { IconsList } from '../../../@model/enums/icons'
import { MAX_WIDTH_TOOLTIP } from '../../../utils/constants'
import { PermissionLevel } from '../../../@model/permission'

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

const store = useStore()

const canView = computed<boolean>(() => {
  return props.modelValue?.permission ? store.getters.abilityCan(props.modelValue.permission, 'view') : true
})

const isCheckType = computed(
  () => props.modelValue instanceof SwitchBaseField || props.modelValue instanceof CheckBaseField,
)

const isRatesType = computed(() => props.modelValue instanceof RatesBaseField)

const rules = computed(() => !isRatesType.value ? props.modelValue?.validationRules : {})

const isCheckTypeWithInfo = computed(() => isCheckType.value && props.withInfo && props.modelValue.info)

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

const canUpdate = computed<boolean>(() =>
  props.modelValue?.permission ? store.getters.abilityCan(props.modelValue?.permission, PermissionLevel.update) : true,
)

const notFilledDateRange = computed(() => {
  return props.modelValue?.isRangeMode && fieldModel.value?.length && !fieldModel.value?.split(props.modelValue.separator)[1]?.length
})

const allCurrencies = computed<string[]>(() => store.getters['appConfigCore/allCurrencies'])

const validationLabel = computed(() => {
  const isCurrencyLabel = allCurrencies.value.includes(props.modelValue.label)

  return isCurrencyLabel ? props.modelValue.label : props.modelValue.label.toLowerCase()
})
</script>

<template>
  <div
    v-if="canView"
    :id="`${modelValue?.key}-field`"
    class="mb-0 field-generator"
    data-test-id="field-generator"
    :class="formGroupClasses"
  >
    <VLabel
      v-if="groupLabel"
      :for="`${modelValue?.key}-field`"
      class="mb-1 field-generator-label text-body-2 text-high-emphasis justify-between"
    >
      <span>
        {{ groupLabel }}
      </span>
      <VTooltip
        v-if="withInfo && modelValue.info"
        :max-width="MAX_WIDTH_TOOLTIP"
      >
        <template #activator="{ props }">
          <VIcon
            v-if="withInfo && modelValue.info"
            :icon="IconsList.InfoIcon"
            v-bind="props"
            class="ml-1 align-text-top text-grey-500"
          />
        </template>

        <template #default>
          <slot :name="FieldGeneratorSlots.InfoText">
            {{ modelValue.info }}
          </slot>
        </template>
      </VTooltip>
    </VLabel>

    <Field
      v-model="fieldModel"
      :name="modelValue.id"
      :label="validationLabel"
      :rules="rules"
      :validate-on-blur="false"
      :validate-on-change="false"
      :validate-on-input="false"
      :validate-on-model-update="!notFilledDateRange"
    >
      <template #default="{ errorMessage }">
        <div :class="{ 'd-flex align-center': isCheckTypeWithInfo }">
          <Component
            :is="localValue"
            :id="`${modelValue.id}-field`"
            v-model="fieldModel"
            :options="options"
            :field="modelValue"
            :disabled="disabled || !canUpdate"
            :placeholder="modelValue.placeholder"
            :size="size"
            v-bind="{ ...$attrs }"
            :errors="Boolean(errorMessage)"
            @search="onSearch"
          >
            <template #[FieldGeneratorSlots.SelectedOptionName]="{ id, optionName }">
              <slot
                :id="id"
                :name="FieldGeneratorSlots.SelectedOptionName"
                :option-name="optionName"
              />
            </template>
          </Component>

          <div v-if="isCheckTypeWithInfo">
            <VTooltip
              :text="modelValue.info"
              :max-width="MAX_WIDTH_TOOLTIP"
            >
              <template #activator="{ props }">
                <VIcon
                  v-if="withInfo && modelValue.info"
                  :icon="IconsList.InfoIcon"
                  v-bind="props"
                  data-test-id="info-with-type-check"
                  class="check-type tooltip-icon ml-1 align-text-top text-grey-500"
                />
              </template>
            </VTooltip>
          </div>
        </div>

        <span
          v-if="errorMessage"
          class="field-generator__error text-error text-caption mt-1"
        >
          <slot
            :name="FieldGeneratorSlots.ErrorMessage"
            :message="errorMessage"
          >
            {{ errorMessage }}
          </slot>
        </span>

        <span
          v-else-if="modelValue.description"
          class="mt-1 text-color-mute text-body-2"
          data-test-id="description"
          :class="{
            'check-description': isCheckType,
          }"
        >
          <slot
            :name="FieldGeneratorSlots.Description"
            :description="modelValue.description"
          >
            {{ modelValue.description }}
          </slot>
        </span>
      </template>
    </Field>
  </div>
</template>

<style lang="scss" scoped>
@import "@styles/variables/_vuetify";

.field-generator {
  color: rgb(var(--v-theme-body));

  .check-type {
    margin-bottom: 0.1rem;
  }
  .form-required &-label:after {
    content: "*";
    color: rgb(var(--v-theme-error));
    margin-left: 0.25rem;
  }

  &__error {
    white-space: break-spaces;
    font-size: $typography-body-2-font-size !important;
  }
}
.check-description {
  font-size: 0.75rem;
  padding-left: 1.8rem;
}
</style>
