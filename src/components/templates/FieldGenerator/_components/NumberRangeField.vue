<template>
  <div class="number-base-field d-flex align-items-center">
    <number-field
      v-model="numberRangeValue.from"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.from }"
    />

    <span class="mx-1"> – </span>

    <number-field
      v-model="numberRangeValue.to"
      :class="inputClass"
      :field="{ ...field, placeholder: placeHolderRange.to }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NumberBaseField } from '../../../../@model/baseField'
import NumberField from './NumberField.vue'
import i18n from '../../../../libs/i18n'
import { TranslateResult } from 'vue-i18n'

interface NumberRangeValue {
  from: string | number
  to: string | number
}

type Props = {
  value: NumberRangeValue
  field?: NumberBaseField
  errors?: Array<string>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  errors: () => [],
  value: () => ({ from: '', to: '' }),
  field: () => ({}),
})

const inputClass = computed(() => ({ 'border-danger rounded': props.errors?.isNotEmpty }))

const emits = defineEmits<{
  (event: 'input', payload: NumberRangeValue): void
}>()

const numberRangeValue = computed({
  get: () => props.value,
  set: (value) => emits('input', value),
})

const getPlaceHolder = (translate: TranslateResult): string =>
  `${props.field.placeholder || ''} ${translate}`.trimLeft()

const placeHolderRange = computed(() => ({
  from: getPlaceHolder(i18n.t('placeholder.minutesRange.from')),
  to: getPlaceHolder(i18n.t('placeholder.minutesRange.to')),
}))
</script>


<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.input-group-text {
  font-weight: $font-weight-bolder;
}
</style>
