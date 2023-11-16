<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { difference } from 'lodash'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import store from '../../../../store'
import type { LocaleVariable } from '../../../../@model/translations'
import { filterString, getVariablesFromLocale } from '../../../../helpers/text-editor'
import type { RichTextBaseField } from '../../../..//@model/templates/baseField'

interface RichTextProps {
  value?: string
  field: RichTextBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<RichTextProps>(), {
  value: '',
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const localisationParameters = ref({})
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)
const watchOptions = { immediate: true, deep: true }

const modelValue = computed({
  get: () => props.value,
  set: value => emit('input', value),
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
  emit('input', filterString(modelValue.value, localeVariables))
}

const handleVariablesChange = () => {
  const localeKeyInText = getVariablesFromLocale(modelValue.value)

  const excessKeyVariable: string
    = difference(localeKeyInText, Object.keys(variableTextBufferStore.value)).at(0) || ''

  onRemoveVariable(excessKeyVariable)
}

watch(() => variableTextBufferStore, handleVariablesChange, watchOptions)
</script>

<template>
  <TextEditorWysiwyg
    v-model.trim="modelValue"
    :placeholder="field.label"
    :disabled="disabled"
    :options-variable="allCurrencies"
    :localisation-parameters="localisationParameters"
    @update-localisation-parameters="setUpdateLocalisationParameters"
    @remove-variable="onRemoveVariable"
  />
</template>
