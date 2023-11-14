<script setup lang="ts">
import { TranslateResult } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { IconsList } from '../@model/enums/icons'
import { TooltipPlacement } from '../@model/enums/tooltip'
import { computed } from 'vue'

enum ButtonCheckboxIconVariant {
  Success = 'flat active',
  Danger = 'flat not-active',
  OutlineSecondary = 'outline-secondary',
}
interface Props {
  value: boolean
  icon: IconsList
  disabled?: boolean
  tooltipText?: TranslateResult
  tooltipPlacement?: TooltipPlacement
}

interface Emits {
  (event: 'click', payload: boolean): void
}

const id = uuidv4()

const props = withDefaults(defineProps<Props>(), {
  tooltipPlacement: TooltipPlacement.Bottom,
  tooltipText: () => '',
})

const emits = defineEmits<Emits>()

const variant = computed((): ButtonCheckboxIconVariant => {
  if (props?.disabled) return ButtonCheckboxIconVariant.OutlineSecondary
  return props?.value ? ButtonCheckboxIconVariant.Success : ButtonCheckboxIconVariant.Danger
})
</script>

<template>
  <div class="btn-check-icon">
    <b-button
      :id="id"
      :variant="variant"
      :disabled="disabled"
      class="btn-icon p-50"
      @click="emits('click', !value)"
    >
      <feather-icon v-if="icon" :icon="icon" />
    </b-button>
    <b-tooltip v-if="tooltipText" :target="id" triggers="hover" :placement="tooltipPlacement">
      {{ tooltipText }}
    </b-tooltip>
  </div>
</template>

<style scoped lang="scss">
@import '../@core/scss/base/core/colors/palette-variables';

.btn-check-icon {
  .active {
    color: $success;
    background-color: #28c76f33;
  }
  .not-active {
    color: $danger;
    background-color: #ea545533;
  }
}
</style>