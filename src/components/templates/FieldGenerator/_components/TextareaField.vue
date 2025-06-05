<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { TextareaBaseField } from '../../../../@model/templates/baseField'
import AppTextarea from '../../../../@core/components/app-form-elements/AppTextarea.vue'

interface TextareaFieldProps {
  modelValue?: string
  placeholder?: string
  field: TextareaBaseField
  disabled?: boolean
  errors?: boolean
}

const props = withDefaults(defineProps<TextareaFieldProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const AUTO_HEIGHT_PARAMS = {
  rows: 1,
  rowHeight: 2,
  autoGrow: false,
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

const textareaField = ref(null)

const onInput = () => {
  const textareaWrapper = textareaField.value?.textarea.$el

  if (textareaWrapper) {
    textareaWrapper.style.height = 'auto'

    const inputElement = textareaWrapper.querySelector('.v-field__input')

    if (inputElement) {
      inputElement.style.whiteSpace = 'pre-line'
      inputElement.style.overflow = 'hidden'
      inputElement.style.height = 'auto'
      if (localModelValue.value.length)
        inputElement.style.height = `${inputElement.scrollHeight}px`
    }
  }
}

watch(() => localModelValue.value, () => {
  if (props.field.autoHeight)
    nextTick(onInput)
}, {
  immediate: true,
  deep: true,
})

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.field.autoHeight)
    return
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    localModelValue.value += '\t\n'
    onInput()
  }
}
</script>

<template>
  <AppTextarea
    ref="textareaField"
    v-model.trim="localModelValue"
    :placeholder="placeholder"
    :error="errors"
    no-resize
    :counter="field.maxLength"
    :maxlength="field.maxLength"
    :disabled="disabled"
    :persistent-counter="Boolean(field.maxLength)"
    :hide-details="!field.maxLength"
    v-bind="autoHeight"
    class="text-area"
    :class="{ 'app-textarea__counter': field.maxLength }"
    data-test-id="textarea-field"
    @keydown="handleKeydown"
  />
</template>

<style lang="scss">
@import "@styles/variables/_vuetify";

.app-textarea__counter {
  position: relative;
  .v-counter {
    font-size: $typography-body-2-font-size;
    color: rgba(var(--v-theme-grey-900), var(--v-muted-placeholder-opacity)) !important;
  }
  .v-input__details {
    position: absolute;
    bottom: -20px;
    width: 100%;
  }
}
</style>
