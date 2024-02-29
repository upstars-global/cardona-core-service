<script setup lang="ts">
import { TranslateResult } from 'vue-i18n'
import { v4 as uuidv4 } from 'uuid'
import { IconsList } from '../@model/enums/icons'
import { TooltipPlacement } from '../@model/enums/tooltip'
import { computed } from 'vue'

enum ButtonCheckboxIconVariant {
  Success = 'flat active',
  Danger = 'flat not-active',
}
interface Props {
  value: boolean
  icon: IconsList
  isStatic?: boolean
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

const variant = computed(
  (): ButtonCheckboxIconVariant =>
    props?.value ? ButtonCheckboxIconVariant.Success : ButtonCheckboxIconVariant.Danger
)

const onClick = () => {
  if (!props.isStatic) {
    emits('click', props.value)
  }
}
</script>

<template>
  <div class="btn-check-icon" :class="{ 'is-static': isStatic }">
    <b-button
      :id="id"
      :variant="variant"
      class="btn-icon p-50"
      :class="{
        'is-static': isStatic,
      }"
      @click="onClick"
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

$success-with-opacity: rgba($success, 0.2);
$danger-with-opacity: rgba($danger, 0.2);

.is-static {
  cursor: initial !important;
}
.btn-check-icon {
  button {
    &.not-active {
      color: $danger;
      border-color: $danger-with-opacity;
      background-color: $danger-with-opacity;
    }
    &.active {
      color: $success;
      border-color: $success-with-opacity;
      background-color: $success-with-opacity;
    }
    &.is-static {
      background-color: initial;
    }
  }
}
</style>
