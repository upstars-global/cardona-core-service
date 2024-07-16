<script setup lang="ts">
import { computed } from 'vue'
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
      class="switch-input"
      :class="{ 'is-disabled': disabled, 'not-checked': !localModelValue }"
      :disabled="disabled"
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

<style lang="scss" scoped>
.switch-input {
}

.v-theme--dark {
  .switch-input {
    :deep(.v-switch__thumb) {
      opacity: 75%;
    }
  }
}

.is-disabled {
  pointer-events: none;
}
</style>
