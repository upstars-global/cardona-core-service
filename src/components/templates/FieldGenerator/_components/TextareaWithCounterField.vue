<script setup lang="ts">
import { computed } from 'vue'
import { FieldInfo } from '@model/field'

type TextareaWithCounterFieldProps = {
  value: string
  field: FieldInfo
  disabled: boolean
  errors: Array<string>
}

const props = withDefaults(defineProps<TextareaWithCounterFieldProps>(), {
  value: '',
  disabled: false,
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()
const maxCharsDefault: number = 100

const maxChars = computed(() => props.field?.maxLength || maxCharsDefault)
const modelValue = computed({
  get: (): string => props.value,
  set: (value: string) => emit('input', value),
})
</script>

<template>
  <div>
    <b-form-textarea
      v-model.trim="modelValue"
      :placeholder="field.label"
      :state="errors.isNotEmpty ? false : null"
      no-resize
      rows="3"
      :disabled="disabled"
      :maxlength="maxChars"
    />
    <small class="textarea-counter-value float-right">
      <span class="char-count">{{ modelValue.length }}</span> / {{ maxChars }}
    </small>
  </div>
</template>

