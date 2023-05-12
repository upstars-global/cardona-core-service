<template>
  <b-form-radio-group v-model="modelValue" :options="field.options" />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { FieldInfo } from '../../../../@model/field'

export default defineComponent({
  name: 'RadioField',
  props: {
    value: {
      type: [String, Boolean],
      required: true,
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return {
      modelValue,
    }
  },
})
</script>
