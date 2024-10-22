<script setup lang="ts">
import { VColors, VVariants } from '../../@model/vuetify'
import BaseModal from '../BaseModal/index.vue'

interface Props {
  modalId: string
  title?: string
  description?: string
}

interface OnCLickModalOkPayload {
  hide: Function
}

interface Emits {
  (event: 'on-click-modal-ok', payload: OnCLickModalOkPayload): void
  (event: 'on-close-modal'): void
}

defineProps<Props>()

const emits = defineEmits<Emits>()

const onClickModalOk = async (hide: Function) => {
  emits('on-click-modal-ok', { hide })
}

const onCloseModal = async (hide: Function) => {
  emits('on-close-modal')
  hide()
}
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="title"
    data-test-id="base-modal"
  >
    <template #default="{ action, payload }">
      <VCardText class="d-flex flex-column">
        <span class="text-body-1 modal-description">{{ payload?.description || description }}</span>
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
          {{ $t('action.add') }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
