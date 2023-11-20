<script setup lang="ts">
import { computed } from 'vue'
import store from '../../../../store'
import { SwitchBaseField } from '../../../../@model/baseField'
import { BSize } from '../../../../@model/bootstrap'
import { IconsList } from '../../../../@model/enums/icons'

type SwitchFieldProps = {
  value: boolean
  field: SwitchBaseField
  disabled?: boolean
  size?: BSize
}

const props = withDefaults(defineProps<SwitchFieldProps>(), {
  value: false,
  size: BSize.Md,
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

const iconName = computed(() => (props.value ? IconsList.CheckCircleIcon : IconsList.XCircleIcon))
const iconVariant = computed(() => (props.value ? 'text-success' : 'text-danger'))
</script>

<template>
  <div class="d-flex align-items-center justify-content-between" :class="`size-${size}`">
    <div class="d-flex align-items-center">
      <b-form-checkbox
        v-model="modelValue"
        switch
        :disabled="disabled || !canUpdate"
        :data-test-state="`${modelValue}`"
      >
        <span class="switch-icon-left">
          <feather-icon :icon="IconsList.CheckIcon" />
        </span>
      </b-form-checkbox>

      <span class="switch-label">
        {{ field.label }}
      </span>
    </div>

    <feather-icon v-if="field.withState" :icon="iconName" :class="iconVariant" />
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
