<script setup lang="ts">
import { computed } from 'vue'
import { PhoneBaseField } from '../../../../@model/baseField'
import { allPhoneCodesWithFlags } from '../../../../helpers/countries'
import Cleave from 'vue-cleave-component'

type PhoneFieldProps = {
  value: string
  field: PhoneBaseField
  disabled?: boolean
  errors?: string[]
}

const props = withDefaults(defineProps<PhoneFieldProps>(), {
  value: '',
  errors: () => [],
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
  const cleanPhoneNumber: string =
    modelValue.value[0] === '+' ? modelValue.value.slice(1) : modelValue.value

  const phoneData = allPhoneCodesWithFlags.find(
    ({ phone }) => cleanPhoneNumber.indexOf(phone) === 0
  )

  return phoneData?.flag
})
</script>

<template>
  <div class="d-flex justify-content-between align-items-center position-relative">
    <p class="flag">
      {{ phoneFlag }}
    </p>

    <cleave
      v-model="modelValue"
      type="text"
      class="form-control"
      :class="{ 'pl-3': phoneFlag, error: errors.isNotEmpty }"
      :placeholder="$t('common.phone._')"
      :disabled="disabled"
      :options="cleaveOptions"
    />
  </div>
</template>

<style scoped lang="scss">
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.flag {
  display: inline-block;
  font-size: 2rem;
  position: absolute;
  top: 9px;
  left: 9px;
  margin: 0;
}

.error {
  border-color: $red;
}
</style>
