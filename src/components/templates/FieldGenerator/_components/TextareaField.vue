<script setup lang="ts">
import { computed } from 'vue'
import type { TextareaBaseField } from '../../../../@model/templates/baseField'
import AppTextarea from '../../../../@core/components/app-form-elements/AppTextarea.vue'
import { IconsList } from '../../../../@model/enums/icons'

interface TextareaFieldProps {
  modelValue?: string
  placeholder?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: boolean
  autoHeight?: boolean
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const AUTO_HEIGHT_PARAMS = {
  rows: 1,
  rowHeight: 15,
  autoGrow: true,
}

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  },
})

const autoHeight = computed(() => props.field?.autoHeight
  ? AUTO_HEIGHT_PARAMS
  : {})

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})
</script>

<template>
  <AppTextarea
    v-model.trim="localModelValue"
    :placeholder="placeholder"
    :error="errors"
    no-resize
    :counter="field.maxLength"
    :maxlength="field.maxLength"
    :disabled="disabled"
    :append-inner-icon="appendInnerIcon"
    :persistent-counter="field.maxLength"
    :hide-details="!field.maxLength"
    v-bind="autoHeight"
    class="text-area"
    :class="{ 'app-textarea__counter': field.maxLength }"
  />
</template>

<style lang="scss">
.app-textarea__counter {
  position: relative;
  .v-input__details {
    position: absolute;
    bottom: -20px;
    width: 100%;
  }
}
</style>
