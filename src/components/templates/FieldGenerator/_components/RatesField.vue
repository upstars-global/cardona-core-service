<template>
  <div v-if="allCurrencies.isNotEmpty" class="full-width">
    <div class="d-flex align-items-center font-small-4 font-weight-bold">
      {{ field.label }}

      <feather-icon
        v-if="field.info"
        v-b-tooltip.hover.top="field.info"
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
import { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'
import { NumberBaseField } from '../../../../@model/baseField'
import FieldGenerator from '../../../../components/templates/FieldGenerator'
import { division, multiplication } from '../../../../helpers/math-operations'
import { IconsList } from '../../../../@model/enums/icons'

type Rates = {
  readonly currency: string
  readonly bet: number | null
}

const props = withDefaults(
  defineProps<{
    value: Array<Rates>
    field: FieldInfo
    disabled?: boolean
    append?: string
  }>(),
  {
    value: () => [] as Array<Rates>,
    append: '',
  }
)

const emit = defineEmits<{
  (event: 'input', value: Array<Rates>): void
}>()

const isNotFilledFormRates = ref(true)
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])

const formRates = ref(
  allCurrencies.value.map((item) => {
    return new NumberBaseField({
      key: item,
      value: 0,
      label: item,
      placeholder: '0.00',
      validationRules: 'required',
      append: props.append,
      withPositiveNumbers: true,
    })
  })
)

watch(
  () => props.value,
  () => {
    if (isNotFilledFormRates.value && props?.value.some((item: Rates) => item.bet)) {
      formRates.value = props.value.map((item: Rates) => {
        return new NumberBaseField({
          key: item.currency,
          value: item.bet ? division(item.bet, 100) : 0,
          label: item.currency,
          placeholder: '0.00',
          validationRules: 'required',
          append: props.append,
          withPositiveNumbers: true,
        })
      })
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
      formRates.value.map((item) => ({
        currency: item.key,
        bet: item.value ? multiplication(item.value, 100) : 0,
      }))
    )
  },
  { deep: true, immediate: true }
)
</script>
