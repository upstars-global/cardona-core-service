<script setup lang="ts">
import { VColors, VVariants } from '../../@model/vuetify'
import BaseModal from '../BaseModal/index.vue'
import type { ConfirmModalPropsOfSlotDefault, ModalActionsFromSlot } from '../../@model/modal'
import { i18n } from '../../plugins/i18n'

interface Props {
  modalId: string
  title?: string
  description?: string
  confirmBtnText?: string
}

interface Emits {
  (event: 'on-click-modal-ok', payload: Pick<ModalActionsFromSlot, 'hide'>): void
  (event: 'on-close-modal'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmBtnText: i18n.t('action.add'),
})

const emits = defineEmits<Emits>()

const onClickModalOk = async (hide: Function) => {
  emits('on-click-modal-ok', { hide })
}

const onCloseModal = (hide: Function) => {
  emits('on-close-modal')
  hide()
}

const getButtonConfirm = (text: string) => text || props.confirmBtnText
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="title"
    data-test-id="base-modal"
  >
    <template #default="{ action, payload }: ConfirmModalPropsOfSlotDefault">
      <VCardText class="d-flex flex-column">
        <span class="text-body-1" data-test-id="modal-description">{{ payload?.description || description }}</span>
      </VCardText>
      <hr>
      <VCardText class="d-flex justify-end gap-3 flex-wrap py-4">
        <VBtn
          :color="VColors.Secondary"
          :variant="VVariants.Outlined"
          @click="onCloseModal(action.hide)"
          data-test-id="btn-cancel"
        >
          {{ $t('action.cancel') }}
        </VBtn>
        <VBtn
          :color="VColors.Primary"
          @click="onClickModalOk(action.hide)"
          data-test-id="btn-add"
        >
          {{ getButtonConfirm(payload.btnConfirmText) }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
