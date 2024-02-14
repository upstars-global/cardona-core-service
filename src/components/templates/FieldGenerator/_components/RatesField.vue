<template>
  <div v-if="allCurrencies.isNotEmpty" class="full-width">
    <div class="d-flex align-items-center font-small-4 font-weight-bold">
      {{ field.label }}

      <feather-icon
        v-if="field.info"
        v-b-tooltip.hover.top="infoTitle"
        :icon="IconsList.InfoIcon"
        class="text-muted ml-25 align-text-top"
      />
    </div>
    <b-row v-if="formRates.length" class="flex-wrap mt-1">
      <b-col v-for="(currency, index) in allCurrencies" :key="currency" md="2" class="px-1 pb-1">
        <field-generator v-model="formRates[index]" :disabled="disabled" />
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import store from '../../../../store'
import { RatesBaseField, NumberBaseField } from '../../../../@model/baseField'
import { RatesValueItem } from '../../../../@model/baseField/rates'
import FieldGenerator from '../../../../components/templates/FieldGenerator'
import { IconsList } from '../../../../@model/enums/icons'

const props = withDefaults(
  defineProps<{
    value: Array<RatesValueItem>
    field: RatesBaseField
    disabled?: boolean
    append?: string
  }>(),
  {
    value: () => [],
    append: '',
  }
)

const emit = defineEmits<{
  (event: 'input', value: Array<RatesValueItem>): void
}>()

const isNotFilledFormRates = ref(true)
const allCurrencies = computed<string[]>(() => store.getters['appConfigCore/allCurrencies'])

const formRates = ref<NumberBaseField[]>(setRates())

watch(
  () => props.value,
  () => {
    if (isNotFilledFormRates.value && props?.value.some((item: RatesValueItem) => item.value)) {
      formRates.value = setRates()

      isNotFilledFormRates.value = false
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => formRates,
  () => {
    emit(
      'input',
      formRates.value.map((item: NumberBaseField) => ({
        currency: item.key,
        value: item.value,
      }))
    )
  },
  { deep: true, immediate: true }
)

function setRates(): NumberBaseField[] {
  return allCurrencies.value.map(
    (currency) =>
      new NumberBaseField({
        id: `${props.field.id}-${currency}`,
        key: currency,
        value: props.value.find((item) => item.currency === currency)?.value ?? 0,
        label: currency,
        placeholder: props.field.placeholder,
        validationRules: props.field.validationRules,
        append: props.append,
        withPositiveNumbers: true,
      })
  )
}

const infoTitle = computed(() => ({
  title: `<div class='${`text-${props.field.infoAlignText}`}'>${props.field.info}</div>`,
  html: true,
}))
</script>
