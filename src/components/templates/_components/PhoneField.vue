<script setup lang="ts">
import { computed } from 'vue'
import { allPhoneCodesWithFlags } from '../../../helpers/countries'
import type { PhoneBaseField } from '../../../@model/templates/baseField'

interface PhoneFieldProps {
  value: string
  field: PhoneBaseField
  disabled?: boolean
  errors?: boolean
}

const props = withDefaults(defineProps<PhoneFieldProps>(), {
  value: '',
})

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const cleaveOptions = {
  blocks: [2, 3, 3, 2, 4],
}

const modelValue = computed({
  get: (): string => props.value,
  set: (value: string) => {
    const phoneWithPlus: string = modelValue.value[0] !== '+' ? `+${value}` : value

    emit('input', phoneWithPlus)
  },
})

const phoneFlag = computed(() => {
  const cleanPhoneNumber: string
    = modelValue.value[0] === '+' ? modelValue.value.slice(1) : modelValue.value

  const phoneData = allPhoneCodesWithFlags.find(
    ({ phone }) => cleanPhoneNumber.indexOf(phone) === 0,
  )

  return phoneData?.flag
})
</script>

<template>
  <div class="d-flex justify-space-between align-center position-relative">
    <p
      class="flag"
      data-test-id="phone-flag"
    >
      {{ phoneFlag }}
    </p>

    <Cleave
      v-model="modelValue"
      type="text"
      class="form-control"
      data-test-id="input-number-phone"
      :class="{ 'pl-3': phoneFlag, 'error': errors }"
      :placeholder="$t('common.phone._')"
      :disabled="disabled"
      :options="cleaveOptions"
    />
  </div>
</template>
