<template>
  <text-editor-wysiwyg
    v-model="modelValue"
    :placeholder="field.label"
    :disabled="disabled"
    :options-variable="allCurrencies"
    :localisation-parameters="localisationParameters"
    @update-localisation-parameters="setUpdateLocalisationParameters"
    @remove-variable="onRemoveVariable"
  />
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import store from '../../../../store'
import { LocaleVariable } from '../../../../@model/translations'
import { difference } from 'lodash'
import { filterString, getVariablesFromLocale } from '../../../../helpers/text-editor'
import { RichTextBaseField } from '../../../../@model/baseField'

type RichTextProps = {
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
  set: (value) => emit('input', value),
})

watch(
  () => props.field,
  () => {
    if (props.field?.form) {
      localisationParameters.value = props.field.form['localisationParameters']
    }
  },
  watchOptions
)

const setUpdateLocalisationParameters = (localeVariables: LocaleVariable) => {
  localisationParameters.value = localeVariables
  props.field.form!['localisationParameters'] = localeVariables
}

const onRemoveVariable = (localeVariables: string): void => {
  emit('input', filterString(modelValue.value, localeVariables))
}

const handleVariablesChange = () => {
  const localeKeyInText = getVariablesFromLocale(modelValue.value)
  const excessKeyVariable: string =
    difference(localeKeyInText, Object.keys(variableTextBufferStore.value)).at(0) || ''
  onRemoveVariable(excessKeyVariable)
}

watch(() => variableTextBufferStore, handleVariablesChange, watchOptions)
</script>
