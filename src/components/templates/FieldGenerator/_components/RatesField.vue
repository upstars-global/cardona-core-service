<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import store from '../../../../store'
import { IconsList } from '../../../../@model/enums/icons'
import type { RatesBaseField } from '../../../../@model/templates/baseField'
import { NumberBaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../index.vue'
import type { RatesValueItem } from '../../../../@model/templates/baseField/rates'

interface Rates {
  readonly currency: string
  readonly bet: number | null
}

const props = withDefaults(
  defineProps<{
    modelValue: Array<RatesValueItem>
    field: RatesBaseField
    disabled?: boolean
    append?: string
  }>(),
  {
    modelValue: () => [],
    append: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: Array<RatesValueItem>): void
}>()

const isNotFilledFormRates = ref(true)
const allCurrencies = computed<string[]>(() => store.getters['appConfigCore/allCurrencies'])

const formRates = ref<NumberBaseField[]>(setRates())

watch(
  () => props.modelValue,
  () => {
    if (isNotFilledFormRates.value && props?.modelValue.some((item: RatesValueItem) => item.value)) {
      formRates.value = setRates()

      isNotFilledFormRates.value = false
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => formRates,
  () => {
    emit(
      'update:modelValue',
      formRates.value.map((item: NumberBaseField) => ({
        currency: item.key,
        value: item.value,
      })),
    )
  },
  { deep: true, immediate: true },
)

function setRates(): NumberBaseField[] {
  return allCurrencies.value.map(
    currency =>
      new NumberBaseField({
        key: currency,
        value: props.modelValue.find(item => item.currency === currency)?.value ?? 0,
        label: currency,
        placeholder: props.field.placeholder,
        validationRules: props.field.validationRules,
        append: props.append,
        withPositiveNumbers: true,
      }),
  )
}
</script>

<template>
  <div
    v-if="allCurrencies.isNotEmpty"
    class="full-width"
  >
    <div class="d-flex align-center font-small-4 font-weight-bold">
      {{ field.label }}

      <VIcon
        v-if="field.info"
        :icon="IconsList.InfoIcon"
        class="text-muted ml-25 align-text-top"
      />
    </div>
    <VRow
      v-if="formRates.length"
      no-gutters
      class="flex-wrap mt-1 gap-1"
    >
      <VCol
        v-for="(currency, index) in allCurrencies"
        :key="currency"
      >
        <FieldGenerator
          v-model="formRates[index]"
          :disabled="disabled"
        />
      </VCol>
    </VRow>
  </div>
</template>
