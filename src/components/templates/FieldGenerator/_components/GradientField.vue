<script setup lang="ts">
import { computed } from 'vue'
import type { GradientBaseField } from '../../../../@model/templates/baseField'
import AppTextarea from '../../../../@core/components/app-form-elements/AppTextarea.vue'
import { VSizes } from '../../../../@model/vuetify'
import ColorPreview from './_partials/ColorPreview.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    field: GradientBaseField
    placeholder?: string
    errors?: boolean
    disabled?: boolean
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
</script>

<template>
  <div class="d-flex align-start gradient-field">
    <AppTextarea
      v-model.trim="localModelValue"
      :placeholder="placeholder"
      :error="errors"
      no-resize
      :rows="field.rows"
      :counter="field.maxLength"
      :maxlength="field.maxLength"
      :disabled="disabled"
      :persistent-counter="Boolean(field.maxLength)"
      :hide-details="!field.maxLength"
      data-test-id="gradient-field"
    />

    <ColorPreview
      :value="modelValue"
      property="background-image"
      :size="VSizes.Large"
      class="ml-3"
    />
  </div>
</template>
