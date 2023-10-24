<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FieldInfo } from '../../../../@model/field'
import generatePassword from '../../../../helpers/password-generator'
import { IconsList } from '../../../../@model/enums/icons'

interface Props {
  modelValue: string
  field: FieldInfo
  errors: Array<string>
  disabled?: boolean
  withPasswordGenerator?: boolean
  showPassword?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  errors: () => [],
})

const emits = defineEmits<{
  (e: 'update:modelValue', string: string): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const inputType = ref(props.showPassword ? 'text' : 'password')

const passwordToggleIcon = computed(() => {
  return inputType.value === 'password' ? IconsList.EyeIcon : IconsList.EyeOffIcon
})

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const setGeneratedPassword = () => {
  emits('update:modelValue', generatePassword())
}
</script>

<template>
  <div class="d-flex">
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
    >
      <template #append>
        <VBtn
          v-if="withPasswordGenerator"
          id="generator-password"
          :disabled="disabled"
          @click="setGeneratedPassword"
        />
      </template>
    </AppTextField>
  </div>
</template>
