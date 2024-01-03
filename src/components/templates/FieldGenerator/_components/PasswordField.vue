<script setup lang="ts">
import { computed, ref } from 'vue'
import generatePassword from '../../../../helpers/password-generator'
import { IconsList } from '../../../../@model/enums/icons'
import type { PasswordBaseField } from '../../../../@model/templates/baseField'
import { VVariants } from '../../../../@model/vuetify'

interface Props {
  modelValue: string
  field: PasswordBaseField
  errors: boolean
  disabled?: boolean
  showPassword?: boolean
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

const inputType = ref(props.showPassword ? 'text' : 'password')

const passwordToggleIcon = computed(() => {
  return inputType.value === 'password' ? IconsList.EyeOffIcon : IconsList.EyeIcon
})

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const setGeneratedPassword = () => {
  emits('update:modelValue', generatePassword())
}
</script>

<template>
  <div class="d-flex gap-2">
    <AppTextField
      :id="field.key"
      v-model.trim="localModelValue"
      :rules="field.validationRules"
      :type="inputType"
      :placeholder="field.placeholder"
      :disabled="disabled"
      :append-inner-icon="passwordToggleIcon"
      name="login-password"
      @click:append-inner="togglePasswordVisibility"
    />
    <VBtn
      v-if="field.withPasswordGenerator"
      id="generator-password"
      :disabled="disabled"
      :variant="VVariants.Outlined"
      size="38"
      @click="setGeneratedPassword"
    >
      <VIcon :icon="IconsList.RefreshCcwIcon" />
    </VBtn>
  </div>
</template>
