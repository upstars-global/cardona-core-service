<script setup lang="ts">
import { computed, ref } from 'vue'
import type { FormDateBaseField } from '../../../../@model/templates/baseField'
import { IconsList } from '../../../../@model/enums/icons'
import AppDateTimePicker from '../../../../@core/components/app-form-elements/AppDateTimePicker.vue'

interface Props {
  modelValue: string | Date
  field: FormDateBaseField
  errors?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | Date): void
}>()

const refPicker = ref({})

const flatPickrConfig = computed(() => ({
  time_24hr: true,
  defaultHour: 0,
  minuteIncrement: 1,
  allowInput: true,
  clickOpens: false,
  ...props.field.config,
}))

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const openByClick = () => {
  refPicker.value.refFlatPicker.fp.open()
}

const isOpen = ref(false)

const onToggle = () => {
  openByClick()
  isOpen.value = !isOpen.value
}
</script>

<template>
  <AppDateTimePicker
    ref="refPicker"
    v-model="localModelValue"
    :append-inner-icon="IconsList.CalendarIcon"
    class="form-date-field"
    :config="flatPickrConfig"
    :class="{ 'form-date-field--open': isOpen }"
    :is-invalid="errors"
    @click:append-inner="onToggle"
  />
</template>

<style lang="scss">
.form-date-field {
  z-index: 5;
  .v-field__append-inner {
    color: rgb(var(--v-theme-primary));
    opacity: 1;
  }

  &--open {
    .v-field__input {
      opacity: 1;
    }
  }
  .flatpickr-wrapper {
    width: 100%;
  }
  .flatpickr-input {
    padding: 0;
  }
}
</style>
