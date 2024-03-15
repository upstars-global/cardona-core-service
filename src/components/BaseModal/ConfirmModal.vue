<script setup lang="ts">
import { VColors, VVariants } from '../../@model/vuetify'
import BaseModal from '../BaseModal/index.vue'

interface Props {
  entityName?: string
  modalId: string
  title: string
  description: string
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

const onCloseModal = (hide: Function) => {
  emits('on-close-modal')
  hide()
}
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="title"
  >
    <template #default="{ action }">
      <VCardText class="d-flex flex-column">
        <span>{{ description }}</span>
      </VCardText>
      <hr>
      <VCardText class="d-flex justify-end gap-3 flex-wrap py-4">
        <VBtn
          :color="VColors.Secondary"
          :variant="VVariants.Outlined"
          @click="onCloseModal(action.hide)"
        >
          {{ $t('action.cancel') }}
        </VBtn>
        <VBtn
          :color="VColors.Success"
          @click="onClickModalOk(action.hide)"
        >
          {{ $t('action.add') }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
