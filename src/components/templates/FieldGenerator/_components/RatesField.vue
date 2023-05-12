<template>
  <div v-if="allCurrencies.isNotEmpty" class="full-width">
    <div class="font-small-4 font-weight-bolder">
      {{ field.label }}
    </div>
    <b-row class="flex-wrap mt-1">
      <b-col v-for="(currency, index) in allCurrencies" :key="currency" md="2" class="px-1">
        <b-form-group :label="currency" :label-for="`currency-${index}`" :class="formGroupClasses">
          <b-input-group :class="{ error: errors.isNotEmpty }">
            <b-form-input
              :id="`currency-${index}`"
              :value="value.find((item) => item.currency === currency).bet / 100"
              :placeholder="currency"
              :state="errors.isNotEmpty ? false : null"
              :type="inputType"
              :disabled="disabled"
              autocomplete="off"
              @input="(val) => inputForm(currency, val)"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
import { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'

export default {
  name: 'RatesField',
  props: {
    value: {
      type: Array,
      default: '',
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },

    errors: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const inputType: string = 'number'
    const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])

    const inputForm = (name, val) => {
      const form = props.value.map((item) => {
        if (item.currency === name) {
          return {
            currency: name,
            bet: val * 100,
          }
        }
        return item
      })
      emit('input', form)
    }

    const formGroupClasses = computed(() => ({
      'form-required': props.field?.validationRules?.includes('required'),
    }))

    return {
      inputType,
      allCurrencies,
      formGroupClasses,

      inputForm,
    }
  },
}
</script>
