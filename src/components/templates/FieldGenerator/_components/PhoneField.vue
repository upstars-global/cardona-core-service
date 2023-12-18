<script setup lang="ts">
import { computed } from 'vue'
import Cleave from 'vue-cleave-component'
import { allPhoneCodesWithFlags } from '../../../../helpers/countries'
import {VVariants} from "@/@model/vuetify";
import {PhoneBaseField} from "../../../../@model/templates/baseField";

interface PhoneFieldProps {
  modelValue: string
  field: PhoneBaseField
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

const phoneFlag = computed(() => {
  const cleanPhoneNumber: string
    = localModelValue.value[0] === '+' ? localModelValue.value.slice(1) : localModelValue.value

  const phoneData = allPhoneCodesWithFlags.find(
    ({ phone }) => cleanPhoneNumber.indexOf(phone) === 0,
  )

  return phoneData?.flag
})

const isFocused = ref(false)
const onFocus = () => {
  isFocused.value = true
}
const onBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div class="position-relative d-flex justify-content-between align-center position-relative">
    <p class="flag">
      {{ phoneFlag }}
    </p>
    <VField
        :variant="VVariants.Outlined"
        :focused="isFocused"
        :active="isFocused"
        :color="isFocused ? 'primary' : 'grey'"
        class="v-input"
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
  padding-left: 2.7rem;
}
</style>
