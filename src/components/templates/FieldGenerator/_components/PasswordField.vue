<template>
  <div class="d-flex">
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
    <b-button
      v-if="withPasswordGenerator"
      id="generator-password"
      v-b-tooltip.hover.bottom="$t('common.generatePassword')"
      variant="flat-primary"
      class="btn-icon ml-1 border-primary"
      @click="setGeneratedPassword"
    >
      <feather-icon :icon="IconsList.RefreshCcwIcon" />
    </b-button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { FieldInfo } from '../../../../@model/field'
import generatePassword from '../../../../helpers/password-generator'
import { IconsList } from '../../../../@model/enums/icons'

type Props = {
  value: string
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

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})

const inputType = ref(props.showPassword ? 'text' : 'password')
const passwordToggleIcon = computed(() => {
  return inputType.value === 'password' ? IconsList.EyeIcon : IconsList.EyeOffIcon
})

const togglePasswordVisibility = () => {
  inputType.value = inputType.value === 'password' ? 'text' : 'password'
}

const setGeneratedPassword = () => {
  emit('input', generatePassword())
}
</script>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.error :deep(.input-group-text) {
  border-color: $red;
}
</style>
