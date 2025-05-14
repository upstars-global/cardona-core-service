<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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

defineEmits<Emits>()

const { t } = useI18n()

interface ButtonConfig {
  label?: string
  variant?: VVariants
  color?: VColors
  disabled?: boolean
  isLoading?: boolean
}

interface Props {
  accept: ButtonConfig
  cancel: ButtonConfig
}

enum Action {
  Accept = 'on-accept',
  Cancel = 'on-cancel',
}

interface Emits {
  (event: Action.Accept): void
  (event: Action.Cancel): void
}

const defaultAcceptProps = {
  label: '',
  color: VColors.Primary,
  disabled: false,
  isLoading: false,
}

const defaultCancelProps = {
  label: t('common.cancel'),
  color: VColors.Secondary,
  variant: VVariants.Outlined,
  disabled: false,
  isLoading: false,
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
    <VBtn
      v-bind="cancelButtonConfig"
      :loading="cancelButtonConfig.isLoading"
      data-test-id="btn-cancel"
      @click="$emit(Action.Cancel)"
    >
      {{ cancelButtonConfig?.label }}
    </VBtn>
    <VBtn
      class="ml-4"
      v-bind="acceptButtonConfig"
      :loading="acceptButtonConfig.isLoading"
      data-test-id="btn-accept"
      @click="$emit(Action.Accept)"
    >
      {{ acceptButtonConfig?.label }}
    </VBtn>
  </div>
</template>

<style scoped lang="scss">

</style>
