<template>
  <div v-if="allCurrencies.isNotEmpty" class="full-width">
    <div class="font-small-4 font-weight-bolder">
      {{ field.label }}
    </div>
    <b-row class="flex-wrap mt-1">
      <b-col v-for="(currency, index) in allCurrencies" :key="currency" md="2" class="px-1">
        <b-form-group :label="currency" :label-for="`currency-${index}`" :class="formGroupClasses">
          <b-input-group :class="{ error: errors.isNotEmpty }">
            <b-form-input
              :id="`currency-${index}`"
              :value="value.find((item) => item.currency === currency)?.bet / 100"
              :placeholder="currency"
              :state="errors.isNotEmpty ? false : null"
              :type="inputType"
              :disabled="disabled"
              required
              autocomplete="off"
              @input="(val) => inputForm(currency, val)"
            />
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { FieldInfo } from '../../../../@model/field'
import store from '../../../../store'

type Rates = {
  readonly currency: string
  readonly bet: number | null
}

const props = withDefaults(
  defineProps<{
    value: Array<Rates>
    field: FieldInfo
    errors: Array<string>
    disabled: Boolean
  }>(),
  {
    value: () => [] as Array<Rates>,
    errors: () => [],
    disabled: () => false,
  }
)

const emit = defineEmits<{
  (event: 'input', value: Array<Rates>): void
}>()

const inputType: string = 'number'
const allCurrencies = computed(() => store.getters['appConfigCore/allCurrencies'])

watchEffect(() => {
  if (props.field.value.some((item: Rates) => item.bet === null)) {
    props.errors.push('')
  }
})

const inputForm = (name, val) => {
  const newValue = props.value.map((item) => {
    if (item.currency === name) {
      return {
        currency: name,
        bet: val ? val * 100 : null,
      }
    }
    return item
  })
  emit('input', newValue)
}

const formGroupClasses = computed(() => ({
  'form-required': props.field?.validationRules?.includes('required'),
}))
</script>
