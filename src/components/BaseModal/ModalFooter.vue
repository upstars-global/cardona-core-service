<script setup lang="ts">
import { computed } from 'vue'
import { VColors, VVariants } from '../../@model/vuetify'

defineOptions({ name: 'ModalFooter' })

const props = withDefaults(defineProps<Props>(), {
  accept: () => ({
    color: VColors.Primary,
    disabled: false,
  }),
  cancel: () => ({
    label: '',
    color: VColors.Secondary,
    variant: VVariants.Outlined,
    disabled: false,
    isLoading: false,
  }),
})

defineEmits([Action.Accept, Action.Cancel])

enum Action {
  Accept = 'onAccept',
  Cancel = 'onCancel',
}

interface ButtonConfig {
  label?: string
  variant?: VVariants
  color?: VColors
  disabled?: boolean
  loading?: boolean
}

interface Props {
  accept: ButtonConfig
  cancel: ButtonConfig
}

const defaultAcceptProps = {
  label: '',
  color: VColors.Primary,
  disabled: false,
  loading: false,
}

const defaultCancelProps = {
  color: VColors.Secondary,
  variant: VVariants.Outlined,
  disabled: false,
  loading: false,
}

const acceptButtonConfig = computed(() => ({
  ...defaultAcceptProps,
  ...props.accept,
}))

const cancelButtonConfig = computed(() => ({
  ...defaultCancelProps,
  ...props.cancel,
}))
</script>

<template>
  <hr class="ma-0 mb-4">
  <div class="px-6 pb-4 d-flex justify-end items-center">
    <slot name="start" />
    <VBtn
      v-bind="cancelButtonConfig"
      data-test-id="btn-cancel"
      @click="$emit(Action.Cancel)"
    >
      {{ cancelButtonConfig?.label || $t('action.cancel') }}
    </VBtn>
    <slot name="middle" />
    <VBtn
      class="ml-4"
      v-bind="acceptButtonConfig"
      data-test-id="btn-accept"
      @click="$emit(Action.Accept)"
    >
      {{ acceptButtonConfig?.label }}
    </VBtn>
    <slot name="end" />
  </div>
</template>
