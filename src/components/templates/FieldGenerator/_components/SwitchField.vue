<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import { FieldInfo } from '../../../../@model/field'
import { BSize, BSizes } from '../../../../@model/bootstrap'
import { IconsList } from '../../../../@model/enums/icons'

type SwitchFieldProps = {
  value: boolean
  field: FieldInfo
  disabled?: boolean
  size?: BSize
}

const props = withDefaults(defineProps<SwitchFieldProps>(), {
  value: false,
  size: BSizes.Md,
})

const emit = defineEmits<{
  (event: 'input', value: boolean): void
}>()

const modelValue = computed({
  get: (): boolean => props.value,
  set: (value: boolean) => emit('input', value),
})

const canUpdate = computed<boolean>(() =>
  props.field.permission ? store.getters.abilityCan(props.field.permission, 'update') : true
)
</script>

<template>
  <div class="d-flex align-items-center" :class="`size-${size}`">
    <b-form-checkbox v-model="modelValue" switch :disabled="disabled || !canUpdate">
      <span class="switch-icon-left">
        <feather-icon :icon="IconsList.CheckIcon" />
      </span>
    </b-form-checkbox>

    <span class="switch-label">
      {{ field.label }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.switch-label {
  margin-left: 0.5rem;
}

.size {
  &-sm {
    .switch-label {
      font-size: $small-font-size;
      margin-left: 0;
    }
  }
}
</style>
