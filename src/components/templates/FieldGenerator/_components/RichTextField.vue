<template>
  <div>
    <text-editor-wysiwyg
      v-model.trim="modelValue"
      :placeholder="field.label"
      :disabled="disabled"
      :options-variable="allCurrencies"
      :localisation-parameters="localisationParameters"
      @update-localisation-parameters="setUpdateLocalisationParameters"
      @remove-variable="onRemoveVariable"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'
import { LocaleVariable } from '../../../../@model/translations'
import { difference } from 'lodash'

export default defineComponent({
  name: 'RichTextField',
  components: {
    TextEditorWysiwyg,
  },

  props: {
    value: {
      type: String,
      required: true,
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },

    errors: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const localisationParameters = ref({})
    const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
    const variableTextBufferStore = computed(() => store.state.textEditor.variableTextBuffer)

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
      { immediate: true, deep: true }
    )

    const filterString = (inputString: string, localeVariables: string): string => {
      const baseString = inputString
      const res = baseString.replaceAll(
        '<span class="variable-box">{' + localeVariables + '}</span>',
        ''
      )
      const existOnlySpaces = !res.replaceAll('&nbsp;', '').trim().length
      if (existOnlySpaces) return ''
      return res
    }

    const setUpdateLocalisationParameters = (localeVariables: LocaleVariable) => {
      localisationParameters.value = localeVariables
      props.field.form!['localisationParameters'] = localeVariables
    }

    const onRemoveVariable = (localeVariables: string): void => {
      modelValue.value = filterString(modelValue.value, localeVariables)
      emit('input', filterString(modelValue.value, localeVariables))
    }

    const getVariablesFromLocale = (localeText: string): string[] => {
      const regex = /\{([^}]+)\}/g
      const matches = localeText.match(regex)
      return (matches?.map((match) => match?.slice(1, -1)).filter(Boolean) || []) as string[]
    }

    const handleVariablesChange = () => {
      const localeKeyInText = getVariablesFromLocale(modelValue.value)
      const excessKeyVariable: string =
        difference(localeKeyInText, Object.keys(variableTextBufferStore.value)).at(0) || ''
      onRemoveVariable(excessKeyVariable)
    }

    const watchOptions = { immediate: true, deep: true }

    watch(() => variableTextBufferStore, handleVariablesChange, watchOptions)

    return {
      modelValue,
      allCurrencies,
      localisationParameters,
      setUpdateLocalisationParameters,
      onRemoveVariable,
    }
  },
})
</script>
