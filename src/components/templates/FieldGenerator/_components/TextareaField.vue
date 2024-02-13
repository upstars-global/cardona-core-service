<template>
  <div>
    <b-form-textarea
      v-model="modelValue"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      no-resize
      :rows="field.rows"
      :disabled="disabled"
      :maxlength="field.maxLength"
      @blur="onBlur"
    />

    <small v-if="field.counter" class="textarea-counter-value float-right">
      <span class="char-count">{{ enteredValueLength }}</span> / {{ field.maxLength }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TextareaBaseField } from '../../../../@model/baseField'
import { trimEdges } from '../../../../helpers'

type TextareaFieldProps = {
  value?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  value: '',
  errors: () => [],
})

const onBlur = () => {
  emit('input', trimEdges(modelValue.value))
}

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const enteredValueLength = computed(() => (modelValue.value ? modelValue.value.length : 0))
</script>
