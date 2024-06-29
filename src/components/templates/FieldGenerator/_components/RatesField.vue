<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import store from '../../../../store'
import { IconsList } from '../../../../@model/enums/icons'
import type { RatesBaseField } from '../../../../@model/templates/baseField'
import { NumberBaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../index.vue'
import type { RatesValueItem } from '../../../../@model/templates/baseField/rates'
import { MAX_WIDTH_TOOLTIP } from '../../../..//utils/constants'

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
    (currency, index) =>
      new NumberBaseField({
        key: currency,
        id: `${props.field.key}-${index}`,
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
    <div class="d-flex align-center">
      <div class="font-small-4 font-weight-medium">
        {{ field.label }}
      </div>

      <VTooltip
        v-if="field.info"
        :text="field.info"
        :max-width="MAX_WIDTH_TOOLTIP"
      >
        <template #activator="{ props }">
          <VIcon
            v-if="field.info"
            :icon="IconsList.InfoIcon"
            v-bind="props"
            class="ml-1 text-muted text-grey-500 align-text-top"
          />
        </template>
      </VTooltip>
    </div>
    <VRow
      v-if="formRates.length"
      class="flex-wrap mt-1"
    >
      <VCol
        v-for="(currency, index) in allCurrencies"
        :key="currency"
        cols="2"
      >
        <FieldGenerator
          v-model="formRates[index]"
          :disabled="disabled"
        />
      </VCol>
    </VRow>
  </div>
</template>
