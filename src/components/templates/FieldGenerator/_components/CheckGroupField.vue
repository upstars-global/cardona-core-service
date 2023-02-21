<template>
  <b-form-group :disabled="disabled">
    <b-form-checkbox
      v-for="option in field.options"
      :key="option.id"
      v-model="modelValue"
      :value="option.id"
      :disabled="option.disabled"
      :name="`check-group-field-${field.key}`"
      class="mt-75"
    >
      {{ option.name }}
    </b-form-checkbox>
  </b-form-group>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { FieldInfo } from '@model/field'

export default defineComponent({
  name: 'CheckGroupField',

  props: {
    value: {
      type: Array,
      default: () => [],
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
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
