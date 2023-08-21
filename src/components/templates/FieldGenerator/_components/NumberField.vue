<template>
  <b-input-group
    :append="appendText"
    :prepend="field.prepend"
    class="input-group-merge"
    :class="{ error: errors.isNotEmpty }"
  >
    <b-form-input
      v-model.trim="value"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      type="number"
      :disabled="disabled"
      autocomplete="off"
      @keydown="onKeyDown"
    />
  </b-input-group>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NumberBaseField } from '../../../../@model/baseField'

type Props = {
  value: string | number
  field: NumberBaseField
  errors?: Array<string>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { errors: () => [], value: '' })
const emits = defineEmits<{
  (event: 'input', string): void
}>()
const appendText = ref(props.field?.append)

const modelValue = computed({
  get: () => props.value,
  set: (value) => {
    emits('input', props.field.withPositiveNumbers ? value.toString().replace(/-/g, '') : value)
  },
})

const onKeyDown = (event) => {
  if (props.field.withPositiveNumbers && event.key === '-') {
    event.preventDefault()
  }
  if (event.key === 'e') {
    event.preventDefault()
  }
}
</script>
