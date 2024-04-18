<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TextBaseField } from '../../../../@model/templates/baseField'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'
import { IconsList } from '../../../../@model/enums/icons'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    field: TextBaseField
    errors?: boolean
    disabled: boolean
  }>(),
  {
    modelValue: '',
  })

const emits = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const inputType = 'text'
const appendText = ref(props.field?.append)

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
  },
})

const placeholder = computed(() => props.field.label)

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})
</script>

<template>
  <div>
    <AppTextField
      v-model.trim="localModelValue"
      :placeholder="placeholder"
      :type="inputType"
      :disabled="disabled"
      :suffix="appendText"
      :error="errors"
      :append-inner-icon="appendInnerIcon"
      autocomplete="off"
      :autofocus="false"
    />
  </div>
</template>
