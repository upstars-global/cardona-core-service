<template>
  <div v-if="allCurrencies.isNotEmpty">
    <div class="font-small-4 font-weight-bolder mb-1">
      {{ field.label }}
    </div>

    <div class="row align-items-center flex-wrap">
      <b-input-group
        v-for="currency in allCurrencies"
        :key="currency"
        class="input-group-merge m-1"
        :class="{ error: errors.isNotEmpty }"
      >
        <b-form-input
          :value="value[currency]"
          :placeholder="currency"
          :state="errors.isNotEmpty ? false : null"
          :type="inputType"
          :disabled="disabled"
          autocomplete="off"
          @input="(val) => inputForm('currency', val)"
        />
      </b-input-group>
    </div>
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
      type: [String, Number],
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
    const inputType: string = 'text'
    const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])

    const inputForm = (name, val) => {
      emit('input', {
        ...props.value,
        [name]: val,
      })
    }

    return {
      inputType,
      allCurrencies,

      inputForm,
    }
  },
}
</script>
