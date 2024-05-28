<script setup lang="ts">
import { computed, ref } from 'vue'

import Cleave from 'vue-cleave-component'
import { getCountryDataByPhone } from '../../../../helpers/countries'
import { VVariants } from '../../../../@model/vuetify'
import type { PhoneBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import 'flag-icons/css/flag-icons.min.css'

interface PhoneFieldProps {
  modelValue: string
  field: PhoneBaseField
  errors?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<PhoneFieldProps>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const cleaveOptions = {
  blocks: [2, 3, 3, 2, 4],
}

const localModelValue = computed({
  get: (): string => props.modelValue,
  set: (value: string) => {
    const phoneWithPlus: string = localModelValue.value[0] !== '+' ? `+${value}` : value

    emit('update:modelValue', phoneWithPlus)
  },
})

const phoneFlag = computed(() => getCountryDataByPhone(localModelValue.value)?.shortCode.toLowerCase())

const isFocused = ref(false)

const onFocus = () => {
  isFocused.value = true
}

const onBlur = () => {
  isFocused.value = false
}

const validateValue = (e: KeyboardEvent) => {
  if (/[^\w\s]/.test(e.key))
    e.preventDefault()
}

const appendInnerIcon = computed(() => {
  if (props.errors)
    return IconsList.InfoIcon

  return null
})
</script>

<template>
  <div
    class="position-relative d-flex justify-space-between align-center phone-field"
    :class="{ 'phone-field--disabled': disabled }"
  >
    <span
      v-if="phoneFlag"
      class="flag-icon fi position-absolute pl-12"
      :class="`fi-${phoneFlag}`"
    />

    <VField
      :variant="VVariants.Outlined"
      :focused="isFocused"
      :active="isFocused"
      :error="errors"
      :color="isFocused ? 'primary' : 'grey'"
      class="v-input pl-4"
      :append-inner-icon="appendInnerIcon"
      :class="{ 'pl-12': phoneFlag, 'v-input--error': errors }"
      @keydown="validateValue"
    >
      <Cleave
        v-model="localModelValue"
        type="text"
        class="v-field__input py-2 phone-input"
        :placeholder="$t('common.phone._')"
        :disabled="disabled"
        :options="cleaveOptions"
        @focus="onFocus"
        @blur="onBlur"
      />
    </VField>
  </div>
</template>

<style scoped lang="scss">
.phone-field {
  &--disabled {
    background: rgb(var(--v-theme-grey-100));
  }
}
.flag {
  display: inline-block;
  font-size: 2rem;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 9px;
  margin: 0;
  line-height: 1.5rem;
}
.phone-input {
  padding-left: 0;
}
</style>
