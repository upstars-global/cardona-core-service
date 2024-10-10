<script setup lang="ts">
import type { TranslateResult } from 'vue-i18n'
import type { VColors, VSizes, VVariants } from '../../../@model/vuetify'
import type { IconsList } from '../../../@model/enums/icons'

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
        @click="$emit('click')"
      >
        <slot>
          {{ label }}
        </slot>
      </VBtn>
    </template>
  </VTooltip>
</template>
