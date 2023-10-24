<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { difference } from 'lodash'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import type { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'
import type { LocaleVariable } from '../../../../@model/translations'
import { filterString, getVariablesFromLocale } from '../../../../helpers/text-editor'

const props = defineProps<{
  modelValue: string
  field: FieldInfo
  errors?: Array<string>
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const localisationParameters = ref({})
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

watch(
  () => props.field,
  () => {
    if (props.field?.form)
      localisationParameters.value = props.field.form.localisationParameters
  },
  { immediate: true, deep: true },
)

const setUpdateLocalisationParameters = (localeVariables: LocaleVariable) => {
  localisationParameters.value = localeVariables
  props.field.form!.localisationParameters = localeVariables
}

const onRemoveVariable = (localeVariables: string): void => {
  emits('update:modelValue', filterString(localModelValue.value, localeVariables))
}

const handleVariablesChange = () => {
  const localeKeyInText = getVariablesFromLocale(localModelValue.value)

  const excessKeyVariable: string
      = difference(localeKeyInText, Object.keys(variableTextBufferStore.value)).at(0) || ''

  onRemoveVariable(excessKeyVariable)
}

const watchOptions = { immediate: true, deep: true }

watch(() => variableTextBufferStore, handleVariablesChange, watchOptions)
</script>

<template>
  <div>
    <TextEditorWysiwyg
      v-model.trim="localModelValue"
      :placeholder="field.label"
      :disabled="disabled"
      :options-variable="allCurrencies"
      :localisation-parameters="localisationParameters"
      @update-localisation-parameters="setUpdateLocalisationParameters"
      @remove-variable="onRemoveVariable"
    />
  </div>
</template>
