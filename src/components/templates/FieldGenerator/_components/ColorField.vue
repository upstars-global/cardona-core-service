<script setup lang="ts">
import { computed } from 'vue'
import type { ColorBaseField } from '../../../../@model/templates/baseField'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'
import { IconsList } from '../../../../@model/enums/icons'
import { VSizes } from '../../../../@model/vuetify'
import ColorPreview from './_partials/ColorPreview.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: ColorBaseField
    errors?: boolean
    disabled: boolean
  }>(),
  {
    modelValue: '',
  })

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:modelValue', value)
  },
})

const placeholder = computed(() => props.field.placeholder || props.field.label)

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})

const previewValue = computed(() => {
  const trimmedValue = props.modelValue?.trim()

  return trimmedValue ? `${props.field?.prepend ?? ''}${trimmedValue}` : ''
})
</script>

<template>
  <div>
    <AppTextField
      v-model.trim="localModelValue"
      :placeholder="placeholder"
      type="text"
      :disabled="disabled"
      :prefix="field?.prepend"
      :suffix="field?.append"
      :error="errors"
      :append-inner-icon="appendInnerIcon"
      autocomplete="off"
      hide-details
      :autofocus="false"
      data-test-id="color-field"
    >
      <template #prepend-inner>
        <ColorPreview
          :value="previewValue"
          property="background-color"
          :size="VSizes.Small"
        />
      </template>
    </AppTextField>
  </div>
</template>

<style lang="scss" scoped>
:deep(.v-field__prepend-inner) {
  align-items: center;
}
</style>
