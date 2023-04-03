<template>
  <b-form-checkbox v-model="modelValue" :switch="isSwitch" :disabled="disabled">
    {{ field.label }}
  </b-form-checkbox>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { FieldInfo } from '../../../../@model/field'

export default defineComponent({
  name: 'CheckField',

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    isSwitch: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { modelValue }
  },
})
</script>
