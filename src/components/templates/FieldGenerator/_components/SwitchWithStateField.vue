<script lang="ts">
import { computed } from 'vue'
import SwitchField from './SwitchField.vue'
import { IconsList } from '../../../../@model/enums/icons'

export default {
  name: 'SwitchWithStateField',
  extends: SwitchField,

  setup(props, { emit }) {
    const modelValue = computed({
      get: (): boolean => props.value,
      set: (value: boolean) => emit('input', value),
    })

    const iconName = computed(() =>
      props.value ? IconsList.CheckCircleIcon : IconsList.XCircleIcon
    )
    const iconVariant = computed(() => (props.value ? 'text-success' : 'text-danger'))

    return {
      modelValue,
      iconName,
      iconVariant,
      IconsList,
    }
  },
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-between">
    <div class="d-flex align-items-center">
      <b-form-checkbox v-model="modelValue" switch :disabled="disabled">
        <span class="switch-icon-left">
          <feather-icon :icon="IconsList.CheckIcon" />
        </span>
      </b-form-checkbox>

      <span class="ml-50">
        {{ field.label }}
      </span>
    </div>

    <feather-icon :icon="iconName" :class="iconVariant" size="14" />
  </div>
</template>
