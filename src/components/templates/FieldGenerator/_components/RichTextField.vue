<script setup lang="ts">
import { computed } from 'vue'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import store from '../../../../store'
import { filterString } from '../../../../helpers/text-editor'
import type { RichTextBaseField } from '../../../../@model/templates/baseField'

interface RichTextProps {
  modelValue: string | number
  field: RichTextBaseField
  disabled?: boolean
  errors?: boolean
  onInput: Function
}

const props = withDefaults(defineProps<RichTextProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)
const watchOptions = { immediate: true, deep: true }

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const onRemoveVariable = (localeVariables: string): void => {
  emit('update:modelValue', filterString(localModelValue.value, localeVariables))
}
</script>

<template>
  <TextEditorWysiwyg
    v-model.trim="localModelValue"
    :placeholder="field.label"
    :disabled="disabled"
    :options-variable="allCurrencies"
    :localisation-parameters="variableTextBufferStore"
    @remove-variable="onRemoveVariable"
  />
</template>
