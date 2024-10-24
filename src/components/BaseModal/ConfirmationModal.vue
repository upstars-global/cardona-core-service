<script setup lang="ts">
import { type TranslateResult } from 'vue-i18n'
import { ModalSizes, VColors, VVariants } from '../../@model/vuetify'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'
import BaseModal from './index.vue'

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
    <template #default="{ action }: BaseModalDefaultPropsOfSlot">
      <p class="px-6 mb-2" data-test-id="modal-description">
        {{ description }}
      </p>

      <hr class="my-4">

      <div class="px-6 pb-4 d-flex justify-end">
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          class="mr-4"
          @click="action.hide"
          data-test-id="btn-cancel"
        >
          {{ $t('common.cancel') }}
        </VBtn>

        <VBtn
          :color="VColors.Error"
          :loading="isLoading"
          @click="$emit('confirmed', action.hide)"
          data-test-id="btn-confirm"
        >
          {{ actionBtnText }}
        </VBtn>
      </div>
    </template>
  </BaseModal>
</template>
