<template>
  <b-form-group v-if="canView" class="mb-0" :class="formGroupClasses" :label-for="value.key">
    <template #label>
      <span>
        {{ groupLabel }}
      </span>

      <feather-icon
        v-if="withInfo && value.info"
        v-b-tooltip.hover.top="value.info"
        icon="InfoIcon"
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
          :is-switch="isSwitch"
          :placeholder="value.placeholder"
          :size="size"
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
import { FieldInfo, FieldType } from '../../../@model/field'
import { BaseField } from '../../../@model/baseField'
import TextField from './_components/TextField.vue'
import NumberField from './_components/NumberField.vue'
import PercentField from './_components/PercentField.vue'
import MinuteField from './_components/MinuteField.vue'
import TextareaField from './_components/TextareaField.vue'
import TextareaWithCounterField from './_components/TextareaWithCounterField.vue'
import RichTextField from './_components/RichTextField.vue'
import CheckField from './_components/CheckField.vue'
import CheckGroupField from './_components/CheckGroupField.vue'
import SelectField from './_components/SelectField.vue'
import MultiSelectField from './_components/MultiSelectField.vue'
import DummySelectField from './_components/DummySelectField.vue'
import TagsField from './_components/TagsField.vue'
import RadioField from './_components/RadioField.vue'
import DateBtnOnlyField from './_components/DateBtnOnlyField.vue'
import DateField from './_components/DateField.vue'
import DateRangeField from './_components/DateRangeField.vue'
import DateTimeField from './_components/DateTimeField.vue'
import SwitchField from './_components/SwitchField.vue'
import SwitchWithStateField from './_components/SwitchWithStateField.vue'
import SumRangeField from './_components/SumRangeField.vue'
import PhoneField from './_components/PhoneField.vue'
import PasswordField from './_components/PasswordField.vue'
import RatesField from './_components/RatesField.vue'

export default defineComponent({
  name: 'FieldGenerator',
  components: {
    TextField,
    PasswordField,
    NumberField,
    PercentField,
    MinuteField,
    TextareaField,
    TextareaWithCounterField,
    RichTextField,
    CheckField,
    CheckGroupField,
    SelectField,
    MultiSelectField,
    DummySelectField,
    TagsField,
    RadioField,
    DateBtnOnlyField,
    DateField,
    DateRangeField,
    DateTimeField,
    SwitchField,
    SwitchWithStateField,
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

    isSwitch: {
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
    const checkFields: Array<string> = [
      FieldType.Check,
      FieldType.Switch,
      FieldType.SwitchWithState,
    ]
    const isCheckType = computed(
      () => props.value instanceof FieldInfo && checkFields.includes(props.value.type)
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
