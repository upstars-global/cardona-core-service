<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useStore } from 'vuex'
import { IconsList } from '../../../../@model/enums/icons'
import type { RatesBaseField } from '../../../../@model/templates/baseField'
import { NumberBaseField, TextBaseField } from '../../../../@model/templates/baseField'
import FieldGenerator from '../index.vue'
import type { RatesValueItem } from '../../../../@model/templates/baseField/rates'
import { MAX_WIDTH_TOOLTIP } from '../../../..//utils/constants'

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

const store = useStore()

interface Rates {
  readonly currency: string
  readonly bet: number | null
}

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
  const field = props.field.withString ? TextBaseField : NumberBaseField

  return allCurrencies.value.map(
    (currency, index) => {
      return new field({
        key: currency,
        id: `${props.field.id}_${currency}`,
        value: props.modelValue.find(item => item.currency === currency)?.value ?? 0,
        label: currency,
        placeholder: props.field.placeholder,
        validationRules: props.field.validationRules,
        append: props.append,
        withPositiveNumbers: true,
      })
    },
  )
}
</script>

<template>
  <div
    v-if="allCurrencies.isNotEmpty"
    class="full-width"
  >
    <div class="d-flex align-center label">
      <div
        class="font-small-4 font-weight-medium"
        data-test-id="label"
      >
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
            data-test-id="icon-info"
          />
        </template>
      </VTooltip>
    </div>
    <VRow
      v-if="formRates.length"
      class="flex-wrap mt-1 currency-list"
      data-test-id="currency-row"
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

<style lang="scss">
// vertical type for modal - list of currencies
.rates-list-type {
  .label {
    display: none !important;
  }

  .currency-list {
    margin-top: 0 !important;

    .v-col-2 {
      flex: 0 0 100%;
      max-width: 100%;
    }

    .field-generator {
      display: flex;
      flex-wrap: wrap;

      .v-label {
        min-width: 60px;
        margin-bottom: 0 !important;
      }

      > div {
        flex: 1;
      }

      .field-generator__error {
        width: 100%;
        margin-left: 60px;
      }
    }
  }
}
</style>
