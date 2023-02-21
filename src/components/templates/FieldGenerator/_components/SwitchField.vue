<script setup lang="ts">
import { computed } from 'vue'
import { getters } from '@/store'
import { FieldInfo } from '@model/field'

type SwitchFieldProps = {
  value: boolean
  field: FieldInfo
  disabled: boolean
}

const props = withDefaults(defineProps<SwitchFieldProps>(), {
  value: false,
  disabled: false,
})

const emit = defineEmits<{
  (event: 'input', value: boolean): void
}>()

const modelValue = computed({
  get: (): boolean => props.value,
  set: (value: boolean) => emit('input', value),
})

const canUpdate = computed<boolean>(() =>
  props.field.permission ? getters.abilityCan(props.field.permission, 'update') : true
)
</script>

<template>
  <div class="d-flex align-items-center">
    <b-form-checkbox v-model="modelValue" switch :disabled="disabled || !canUpdate">
      <span class="switch-icon-left">
        <feather-icon icon="CheckIcon" />
      </span>
    </b-form-checkbox>

    <span class="ml-50">
      {{ field.label }}
    </span>
  </div>
</template>
