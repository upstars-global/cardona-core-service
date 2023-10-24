<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import type { FieldInfo } from '../../../../@model/field'
import { BSize } from '../../../../@model/bootstrap'

interface SwitchFieldProps {
  modelValue: boolean
  field: FieldInfo
  disabled?: boolean
  size?: BSize // TODO: refactor sizes
}

const props = withDefaults(defineProps<SwitchFieldProps>(), {
  value: false,
  size: BSize.Md,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const localModelValue = computed({
  get: (): boolean => props.modelValue,
  set: (value: boolean) => emits('update:modelValue', value),
})

const canUpdate = computed<boolean>(() =>
  props.field.permission ? store.getters.abilityCan(props.field.permission, 'update') : true,
)
</script>

<template>
  <div
    class="d-flex align-items-center"
    :class="`size-${size}`"
  >
    <VSwitch
      v-model="localModelValue"
      :disabled="disabled || !canUpdate"
    />

    <span class="switch-label">
      {{ field.label }}
    </span>
  </div>
</template>
