<template>
  <b-input-group class="input-group-merge" :class="{ error: errors.isNotEmpty }">
    <b-form-input
      :id="field.key"
      v-model.trim="modelValue"
      :state="errors.isNotEmpty ? false : null"
      :type="inputType"
      name="login-password"
      :placeholder="field.placeholder"
    />
    <b-input-group-append is-text>
      <feather-icon
        class="cursor-pointer"
        :icon="passwordToggleIcon"
        @click="togglePasswordVisibility"
      />
    </b-input-group-append>
  </b-input-group>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FieldInfo } from '../../../../@model/field'

const props = defineProps<{
  value: string
  field: FieldInfo
  errors: Array<string>
  disabled: Boolean
}>()
const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const inputType = ref('password')
const passwordToggleIcon = computed(() => {
  return inputType.value === 'password' ? 'EyeIcon' : 'EyeOffIcon'
})

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}
</script>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.error :deep(.input-group-text) {
  border-color: $red;
}
</style>
