<script setup lang="ts">
import { computed, ref } from 'vue'
import generatePassword from '../../../../helpers/password-generator'
import { IconsList } from '../../../../@model/enums/icons'
import type { PasswordBaseField } from '../../../../@model/templates/baseField'
import { VVariants } from '../../../../@model/vuetify'
import AppTextField from '../../../../@core/components/app-form-elements/AppTextField.vue'

interface Props {
  modelValue: string
  field: PasswordBaseField
  errors: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emits = defineEmits<{
  (e: 'update:modelValue', string: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const inputType = ref(props.field.showPassword ? 'text' : 'password')

const passwordToggleIcon = computed(() => {
  return inputType.value === 'password' ? IconsList.EyeIcon : IconsList.EyeOffIcon
})

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const setGeneratedPassword = () => {
  emits('update:modelValue', generatePassword())
}

const isAttach = computed(() => process.env.NODE_ENV === 'test')
</script>

<template>
  <div class="d-flex gap-2">
    <AppTextField
      :id="field.key"
      v-model.trim="localModelValue"
      :type="inputType"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :error="errors"
      :append-inner-icon="passwordToggleIcon"
      name="login-password"
      autocomplete="off"
      :autofocus="false"
      @click:append-inner="togglePasswordVisibility"
    />
    <VTooltip
      :attach="isAttach"
      :text="$t('common.generatePassword')"
      location="bottom"
      data-test-id="tooltip"
    >
      <template #activator="{ props }">
        <VBtn
          v-if="field.withPasswordGenerator"
          id="generator-password"
          data-test-id="btn-generate-password"
          :disabled="disabled"
          :variant="VVariants.Outlined"
          size="38"
          v-bind="props"
          @click="setGeneratedPassword"
        >
          <VIcon :icon="IconsList.RefreshCcwIcon" />
        </VBtn>
      </template>
    </VTooltip>
  </div>
</template>
