<template>
  <b-input-group
    :append="appendText"
    :prepend="field.prepend"
    class="input-group-merge"
    :class="{ error: errors.isNotEmpty }"
  >
    <b-form-input
      v-model.trim="modelValue"
      :placeholder="field.placeholder || field.label"
      :state="errors.isNotEmpty ? false : null"
      type="number"
      :disabled="disabled"
      autocomplete="off"
      @keydown="onKeyDown"
    />
  </b-input-group>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NumberBaseField } from '../../../../@model/baseField'
import { NumberOrString } from '../../../../@model'

type Props = {
  value: NumberOrString
  field: NumberBaseField
  errors?: Array<string>
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), { errors: () => [], value: '' })
const emits = defineEmits<{
  (event: 'input', string): void
}>()
const appendText = ref(props.field?.append)

const getPositiveNumbers = (value: NumberOrString): NumberOrString =>
  props.field.withPositiveNumbers ? value.toString().replace(/-/g, '') : value

const getIntegerNumbers = (value: NumberOrString): NumberOrString =>
  props.field.isIntegerNumbers ? value.toString().replace(/[,.]/g, '') : value

const getMappedValue = (value: NumberOrString): NumberOrString =>
  [getPositiveNumbers, getIntegerNumbers].reduce(
    (updatedValue, mappedMethod) => mappedMethod(updatedValue),
    value
  )

const modelValue = computed({
  get: () => props.value,
  set: (value) => {
    emits('input', getMappedValue(value))
  },
})

const disabledKeys = computed(() => [
  'e',
  props.field.isIntegerNumbers && '.',
  props.field.withPositiveNumbers && '-',
])

const onKeyDown = (event) => {
  if (disabledKeys.value.some((key) => key === event.key)) {
    event.preventDefault()
  }
}
</script>


<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.input-group-text {
  font-weight: $font-weight-bold;
}
.input-group-merge {
  :deep(.input-group-append) {
    .input-group-text {
      font-weight: $font-weight-normal;
    }
  }
  :deep(.input-group-prepend) {
    .input-group-text {
      font-weight: $font-weight-normal;
    }
  }
}

.error {
  .input-group-text {
    border-color: $red;
  }
}
</style>

