<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { difference } from 'lodash'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import store from '../../../../store'
import type { LocaleVariable } from '../../../../@model/translations'
import { filterString, getVariablesFromLocale } from '../../../../helpers/text-editor'
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

const localisationParameters = ref({})
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)
const watchOptions = { immediate: true, deep: true }

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

watch(
  () => props.field,
  () => {
    if (props.field?.form)
      localisationParameters.value = props.field.form.localisationParameters
  },
  watchOptions,
)

const setUpdateLocalisationParameters = (localeVariables: LocaleVariable = {}) => {
  localisationParameters.value = localeVariables

  // FIX WHEN INCLUDE SEO AND LOCALIZATION
  // props.field.form!.localisationParameters = localeVariables
}

const onRemoveVariable = (localeVariables: string): void => {
  emit('update:modelValue', filterString(localModelValue.value, localeVariables))
}

const handleVariablesChange = () => {
  const localeKeyInText = getVariablesFromLocale(localModelValue.value)

  const excessKeyVariable: string
    = difference(localeKeyInText, Object.keys(variableTextBufferStore.value)).at(0) || ''

  onRemoveVariable(excessKeyVariable)
}

watch(() => variableTextBufferStore, handleVariablesChange, watchOptions)
</script>

<template>
  <TextEditorWysiwyg
    v-model.trim="localModelValue"
    :placeholder="field.label"
    :disabled="disabled"
    :options-variable="allCurrencies"
    :localisation-parameters="localisationParameters"
    :on-input="onInput"
    @update-localisation-parameters="setUpdateLocalisationParameters"
    @remove-variable="onRemoveVariable"
  />
</template>
