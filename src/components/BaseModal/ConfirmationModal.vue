<script setup lang="ts">
import { type TranslateResult } from 'vue-i18n'
import { ModalSizes, VColors } from '../../@model/vuetify'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'
import BaseModal from './index.vue'
import ModalFooter from './ModalFooter.vue'

defineProps<{
  modalId: string
  title: TranslateResult
  description: TranslateResult
  actionBtnText: TranslateResult
  isLoading: boolean
}>()

defineEmits<{
  confirmed: [hide: Function]
}>()
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="title"
    :size="ModalSizes.Small"
    centered
  >
    <template #default>
      <p data-test-id="modal-description">
        {{ description }}
      </p>
    </template>
    <template #modal-footer="{ action } : BaseModalDefaultPropsOfSlot">
      <ModalFooter
        :cancel="{
          label: $t('common.cancel'),
        }"
        :accept="{
          color: VColors.Error,
          label: actionBtnText,
          disabled: isLoading,
          isLoading,
        }"
        @on-cancel="action.hide"
        @on-accept="$emit('confirmed', action.hide)"
      />
    </template>
  </BaseModal>
</template>
