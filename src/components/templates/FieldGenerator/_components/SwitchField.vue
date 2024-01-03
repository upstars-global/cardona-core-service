<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import { IconsList } from '../../../../@model/enums/icons'
import type { SwitchBaseField } from '../../../../@model/templates/baseField'
import { VSizes } from '../../../../@model/vuetify'

interface SwitchFieldProps {
  modelValue: boolean
  field: SwitchBaseField
  disabled?: boolean
  size?: VSizes
}

const props = withDefaults(defineProps<SwitchFieldProps>(), {
  modelValue: false,
  size: VSizes.Medium,
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

const iconName = computed(() => (props.modelValue ? IconsList.CheckCircleIcon : IconsList.XCircleIcon))
const iconVariant = computed(() => (props.modelValue ? 'text-success' : 'text-error'))
</script>

<template>
  <div
    class="d-flex align-center gap-3"
    :class="`size-${size}`"
  >
    <VSwitch
      v-model="localModelValue"
      :disabled="disabled || !canUpdate"
    />

    <span class="switch-label">
      {{ field.label }}
    </span>

    <VIcon
      v-if="field.withState"
      class="ml-auto"
      :icon="iconName"
      :class="iconVariant"
    />
  </div>
</template>
