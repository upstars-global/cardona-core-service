<template>
  <b-input-group
    :append="appendText"
    class="input-group-merge"
    :class="{ error: errors.isNotEmpty }"
  >
    <b-form-input
      v-model.trim="modelValue"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      :type="inputType"
      :disabled="disabled"
      autocomplete="off"
    />
  </b-input-group>
</template>

<script lang="ts">
import { computed, PropType } from 'vue'
import { FieldInfo } from '@model/field'

export default {
  name: 'TextField',
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

    append: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const inputType: string = 'text'
    const appendText: string = String(props.append)

    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { inputType, appendText, modelValue }
  },
}
</script>
