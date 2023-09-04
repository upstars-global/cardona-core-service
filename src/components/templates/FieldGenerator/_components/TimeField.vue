<template>
  <b-form-timepicker
    v-model="modelValue"
    locale="uk"
    no-close-button
    class="timepicker-field"
    :disabled="disabled"
    :size="size"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TimeBaseField } from '../../../../@model/baseField'
import { BSize } from '../../../../@model/bootstrap'

type TimeFieldProps = {
  value?: string
  field: TimeBaseField
  disabled?: boolean
  size?: BSize
}

const props = withDefaults(defineProps<TimeFieldProps>(), {
  value: '',
  size: BSize.Md,
})

const emit = defineEmits<{
  (event: 'input', value: string): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (value) => emit('input', value),
})
</script>

<style scoped lang="scss">
.timepicker-field {
  :deep(label:after) {
    content: '';
  }
}
</style>
