<script setup lang="ts">
import { computed } from 'vue'
import i18n from '../../../../libs/i18n'
import { BVariant, BSize } from '../../../../@model/bootstrap'
import { FormDateBaseField } from '../../../../@model/baseField'

type Props = {
  value: string | Date
  field: FormDateBaseField
  errors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  value: '',
  errors: () => [],
})

const emit = defineEmits<{
  (event: 'input', value: string | Date): void
}>()

const currentLocale: string = i18n.locale

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<template>
  <b-input-group class="btn-date-group">
    <b-form-input
      id="date-btn-only-input"
      v-model="modelValue"
      type="text"
      :placeholder="field.placeholder"
      autocomplete="off"
      show-decade-nav
      :class="{ error: errors.isNotEmpty }"
    />
    <b-input-group-append>
      <b-form-datepicker
        v-model="modelValue"
        show-decade-nav
        :button-only="field.buttonOnly"
        right
        :locale="currentLocale"
        aria-controls="date-btn-only-input"
        :button-variant="BVariant.OutlinePrimary"
        :size="BSize.Sm"
      />
    </b-input-group-append>
  </b-input-group>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.error {
  border-color: $red;
}
</style>