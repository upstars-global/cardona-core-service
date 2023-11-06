<template>
  <b-form-group
    v-if="canView"
    :id="`${value.key}-field`"
    class="mb-0"
    :class="formGroupClasses"
    :label-for="value.key"
  >
    <template #label>
      <span>
        {{ groupLabel }}
      </span>

      <feather-icon
        v-if="withInfo && value.info"
        v-b-tooltip.hover.top="value.info"
        :icon="IconsList.InfoIcon"
        class="text-muted ml-25 align-text-top"
      />
    </template>

    <template #default>
      <validation-provider
        v-slot="{ errors }"
        :name="value.label"
        :vid="value.key"
        :rules="value.validationRules"
      >
        <component
          :is="value.component || `${value.type}-field`"
          :id="value.key"
          v-model="fieldModel"
          :options="options"
          :field="value"
          :errors="errors"
          :disabled="disabled"
          :placeholder="value.placeholder"
          :size="size"
          v-bind="$attrs"
          @search="onSearch"
        />

        <small
          :class="{
            'text-danger': errors.isNotEmpty,
            'check-description': isCheckType && value.description,
          }"
        >
          {{ errors[0] || value.description }}
        </small>
      </validation-provider>
    </template>
  </b-form-group>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import store from '../../../store'
import { FieldInfo } from '../../../@model/field'
import { BaseField, SwitchBaseField, CheckBaseField } from '../../../@model/baseField'
import RichTextField from './_components/RichTextField.vue'
import CheckGroupField from './_components/CheckGroupField.vue'
import DummySelectField from './_components/DummySelectField.vue'
import TagsField from './_components/TagsField.vue'
import RadioField from './_components/RadioField.vue'
import DateBtnOnlyField from './_components/DateBtnOnlyField.vue'
import SwitchField from './_components/SwitchField.vue'
import SumRangeField from './_components/SumRangeField.vue'
import PhoneField from './_components/PhoneField.vue'
import PasswordField from './_components/PasswordField.vue'
import RatesField from './_components/RatesField.vue'
import { IconsList } from '../../../@model/enums/icons'

export default defineComponent({
  name: 'FieldGenerator',
  components: {
    PasswordField,
    RichTextField,
    CheckGroupField,
    DummySelectField,
    TagsField,
    RadioField,
    DateBtnOnlyField,
    SwitchField,
    SumRangeField,
    PhoneField,
    RatesField,
  },

  props: {
    value: {
      type: Object as PropType<FieldInfo | BaseField>,
      required: true,
    },

    options: {
      type: Array,
      default: () => [],
    },

    withLabel: {
      type: Boolean,
      default: true,
    },

    withInfo: {
      type: Boolean,
      default: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'md',
    },
  },

  emits: ['input', 'search'],

  setup(props, { emit }) {
    const canView = computed<boolean>(() =>
      props.value.permission ? store.getters.abilityCan(props.value.permission, 'view') : true
    )
    const isCheckType = computed(
      () => props.value instanceof SwitchBaseField || props.value instanceof CheckBaseField
    )
    const groupLabel = computed(() =>
      props.withLabel && !isCheckType.value ? props.value.label : ''
    )
    const formGroupClasses = computed(() => ({
      'form-required':
        props.withLabel && props.value?.validationRules?.includes('required') && groupLabel.value,
    }))

    const fieldModel = computed({
      get: () => props.value.value,
      set: (value) => {
        if (props.value instanceof BaseField) {
          // eslint-disable-next-line vue/no-mutating-props
          props.value.value = value
          emit('input', props.value)
        } else {
          emit('input', new FieldInfo<any>({ ...props.value, value }))
        }
      },
    })

    const onSearch = (search: string) => emit('search', search)

    return {
      canView,
      isCheckType,
      groupLabel,
      formGroupClasses,
      fieldModel,
      IconsList,
      onSearch,
    }
  },
})
</script>

<style lang="scss" scoped>
.check-description {
  font-size: 0.75rem;
  padding-left: 1.8rem;
}
</style>
