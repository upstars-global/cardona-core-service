<script setup lang="ts">
import type { TranslateResult } from 'vue-i18n'
import type { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import type { IconsList } from '../../../@model/enums/icons'
import { IS_TEST_ENV } from '@/utils/constants'

interface Props {
  tooltipText: TranslateResult
  location?: string
  size?: VSizes | string | number
  color?: VColors
  variant?: VVariants
  appendIcon?: IconsList
  prependIcon?: IconsList
  disabled?: boolean
  label?: string
}

interface Emits {
  (event: 'click')
}

defineProps<Props>()
defineEmits<Emits>()
</script>

<template>
  <VTooltip
    :attach="IS_TEST_ENV"
    :location="location"
    :text="tooltipText"
  >
    <template #activator="{ props }">
      <VBtn
        :append-icon="appendIcon"
        :prepend-icon="prependIcon"
        :variant="variant"
        :size="size"
        :color="color"
        v-bind="props"
        :disabled="disabled"
        data-test-id="tooltip-activator"
        @click="$emit('click')"
      >
        <slot>
          {{ label }}
        </slot>
      </VBtn>
    </template>
  </VTooltip>
</template>
