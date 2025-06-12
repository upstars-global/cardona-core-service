<script setup lang="ts">
import { VColors } from '../../@model/vuetify'
import BaseModal from '../BaseModal/index.vue'
import type { ConfirmModalPropsOfSlotDefault, ModalActionsFromSlot } from '../../@model/modal'
import { i18n } from '../../plugins/i18n'
import ModalFooter from './ModalFooter.vue'

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
      <div>
        <span
          class="text-body-1"
          data-test-id="modal-description"
        >{{ payload?.description || description }}</span>
      </div>
    </template>
    <template #modal-footer="{ action, payload }">
      <ModalFooter
        :cancel="{
          label: $t('action.cancel'),
        }"
        :accept="{
          color: VColors.Primary,
          label: getButtonConfirm(payload?.btnConfirmText),
        }"
        @on-cancel="onCloseModal(action.hide)"
        @on-accept="onClickModalOk(action.hide)"
      />
    </template>
  </BaseModal>
</template>
