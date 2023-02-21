<template>
  <div>
    <b-form-textarea
      v-model.trim="modelValue"
      :placeholder="field.label"
      :state="errors.isNotEmpty ? false : null"
      no-resize
      rows="4"
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { FieldInfo } from '@model/field'

export default defineComponent({
  name: 'TextareaField',
  props: {
    value: {
      type: String,
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
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { modelValue }
  },
})
</script>
