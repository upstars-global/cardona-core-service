<template>
  <text-editor-wysiwyg
    v-model.trim="modelValue"
    :placeholder="field.label"
    :disabled="disabled"
    :options-variable="allCurrencies"
    :localisation-parameters="localisationParameters"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import TextEditorWysiwyg from '@/components/TextEditorWysiwyg'
import { FieldInfo } from '@model/field'
import { getters } from '@/store'

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
    const allCurrencies = computed(() => getters['appConfig/allCurrencies'])
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

    return {
      modelValue,
      allCurrencies,
      localisationParameters,
    }
  },
})
</script>
