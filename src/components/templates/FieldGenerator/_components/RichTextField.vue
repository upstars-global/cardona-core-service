<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import TextEditorWysiwyg from '../../../../components/TextEditorWysiwyg/index.vue'
import { filterString } from '../../../../helpers/text-editor'
import type { RichTextBaseField } from '../../../../@model/templates/baseField'
import { useTextEditorStore } from '../../../../stores/textEditor'

interface RichTextProps {
  modelValue: string | number
  field: RichTextBaseField
  disabled?: boolean
  errors?: boolean
  onInput?: Function
}

const props = withDefaults(defineProps<RichTextProps>(), {
  modelValue: '',
  onInput: () => ({}),
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const store = useStore()
const textEditorStore = useTextEditorStore()

const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])
const variableTextBufferStore = computed(() => textEditorStore.variableTextBuffer)

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const onRemoveVariable = (localeVariables: string): void => {
  emit('update:modelValue', filterString(localModelValue.value, localeVariables))
}
</script>

<template>
  <div>
    <TextEditorWysiwyg
      v-model="localModelValue"
      :class="{ errors }"
      :placeholder="field.label"
      :disabled="disabled"
      :options-variable="allCurrencies"
      :localisation-parameters="variableTextBufferStore"
      @remove-variable="onRemoveVariable"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.errors) {
  .fr-toolbar, .fr-second-toolbar {
    border-color: rgba(var(--v-theme-error)) !important;
  }

  .fr-wrapper {
    border-right-color: rgba(var(--v-theme-error)) !important;
    border-left-color: rgba(var(--v-theme-error)) !important;
  }
}
</style>
