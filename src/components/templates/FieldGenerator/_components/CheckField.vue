<script setup lang="ts">
import { computed } from 'vue'
import type { CheckBaseField } from '../../../../@model/templates/baseField'
interface Props {
  modelValue?: boolean
  field: CheckBaseField
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const localModelValue = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})
</script>

<template>
  <div>
    <VCheckbox
      v-model="localModelValue"
      :disabled="disabled"
      :label="field.label"
      class="base-checkbox"
    />
  </div>
</template>
