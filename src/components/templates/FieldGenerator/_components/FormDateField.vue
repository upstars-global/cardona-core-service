<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormDateBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'

interface Props {
  modelValue: string | Date
  field: FormDateBaseField
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | Date): void
}>()

const refPicker = ref({})

const flatPickrConfig = computed(() => ({
  dateFormat: props.field.dateFormat,
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
  allowInput: true,
  clickOpens: false,
}))

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const toggle = () => {
  refPicker.value.refFlatPicker.fp.open()
}
</script>

<template>
  <AppDateTimePicker
    ref="refPicker"
    v-model="localModelValue"
    :append-inner-icon="IconsList.CalendarIcon"
    class="form-date-field"
    @click:control="toggle"
  />
</template>

<style lang="scss">
.form-date-field {
  .v-field__append-inner {
    color: rgb(var(--v-theme-primary));
    opacity: 1;
  }
}
</style>
