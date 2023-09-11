<template>
  <div>
    <text-editor-wysiwyg
      v-model.trim="modelValue"
      :placeholder="field.label"
      :disabled="disabled"
      :options-variable="allCurrencies"
      :localisation-parameters="localisationParameters"
      @update-localisation-parameters="setUpdateLocalisationParameters"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'
import { LocaleVariable } from '../../../../@model/translations'

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

    const filterString = (inputString: string, localeVariables: LocaleVariable) => {
      const regex = /<span class="variable-box">\{([a-zA-Z]+)\}<\/span>/g

      const filteredString = inputString.replace(regex, (match, key) => {
        if (localeVariables.hasOwnProperty(key)) return match
        return ''
      })

      return filteredString
    }

    const setUpdateLocalisationParameters = (localeVariables: LocaleVariable) => {
      localisationParameters.value = localeVariables
      modelValue.value = filterString(modelValue.value, localeVariables)
      props!.field!.form!['localisationParameters'] = localeVariables
    }

    return {
      modelValue,
      allCurrencies,
      localisationParameters,
      setUpdateLocalisationParameters,
    }
  },
})
</script>
