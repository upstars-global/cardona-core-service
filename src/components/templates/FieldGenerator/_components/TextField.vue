<template>
  <b-input-group
    :append="appendText"
    :prepend="field.prepend"
    class="input-group-merge"
    :class="{ error: errors.isNotEmpty }"
  >
    <b-form-input
      v-model="modelValue"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      :type="inputType"
      :disabled="disabled"
      autocomplete="off"
      @blur="onBlur"
    />
  </b-input-group>
</template>

<script lang="ts">
import { computed, PropType, ref } from 'vue'
import { TextBaseField } from '../../../../@model/baseField'
import { trimEdges } from '../../../../helpers'

export default {
  name: 'TextField',
  props: {
    value: {
      type: [String, Number],
      default: '',
    },

    field: {
      type: Object as PropType<TextBaseField>,
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
    const appendText = ref(props.field?.append)

    const onBlur = () => {
      emit('input', trimEdges(modelValue.value))
    }

    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { inputType, appendText, modelValue, onBlur }
  },
}
</script>
