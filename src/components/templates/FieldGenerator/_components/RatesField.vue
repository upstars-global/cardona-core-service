<template>
  <div v-if="allCurrencies.isNotEmpty">
    <b-row class="mt-2 flex-wrap">
      <b-col v-for="currency in allCurrencies" :key="currency" md="2" class="p-1">
        <b-input-group
          class="input-group-merge m-1"
          :class="{ error: errors.isNotEmpty }"
          :label="currency"
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
