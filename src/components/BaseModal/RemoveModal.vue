<script setup lang="ts">
import { ref } from 'vue'
import { VColors, VVariants } from '../../@model/vuetify'
import AppTextarea from '../../@core/components/app-form-elements/AppTextarea.vue'
import BaseModal from '../BaseModal/index.vue'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'

interface Props {
  entityName?: string
  removeModalId: string
  title?: string
  description?: string
  withRemoveComment?: boolean
  removeBtnColor: VColors
  removeBtnVariant: VVariants
  cancelBtnColor: VColors
  cancelBtnVariant: VVariants
}

interface OnCLickModalOkPayload {
  hide: Function
  commentToRemove: string
}

interface Emits {
  (event: 'on-click-modal-ok', payload: OnCLickModalOkPayload): void
  (event: 'on-close-modal'): void
}

withDefaults(defineProps<Props>(), {
  removeBtnColor: VColors.Error,
  removeBtnVariant: VVariants.Flat,
  cancelBtnColor: VColors.Secondary,
  cancelBtnVariant: VVariants.Outlined,
})

const emits = defineEmits<Emits>()

const commentToRemove = ref()

const onClickModalOk = async (hide: Function) => {
  emits('on-click-modal-ok', { hide, commentToRemove: commentToRemove.value })
}

const onCloseModal = (hide: Function) => {
  emits('on-close-modal')
  hide()
}
</script>

<template>
  <BaseModal
    :id="removeModalId"
    :title="title || $t(`modal.remove${entityName}.title`)"
    @hide="$emit('on-close-modal')"
  >
    <template #default="{ action }: BaseModalDefaultPropsOfSlot">
      <VCardText
        :class="{ 'pb-16': withRemoveComment }"
        class="d-flex flex-column pt-0"
      >
        <span class="text-body-1" data-test-id="modal-description">{{ description || $t(`modal.remove${entityName}.description`) }}</span>
        <AppTextarea
          v-if="withRemoveComment"
          v-model.trim="commentToRemove"
          :label="$t('common.comment')"
          data-test-id="comment-to-remove"
          rows="3"
          :placeholder="$t('common.comment')"
        />
      </VCardText>
      <hr>
      <VCardText class="d-flex justify-end gap-3 flex-wrap pt-0 pb-4">
        <VBtn
          :color="cancelBtnColor"
          :variant="cancelBtnVariant"
          @click="onCloseModal(action.hide)"
          data-test-id="btn-cancel"
        >
          {{ $t('action.cancel') }}
        </VBtn>
        <VBtn
          :color="removeBtnColor"
          :variant="removeBtnVariant"
          @click="onClickModalOk(action.hide)"
          data-test-id="btn-remove"
        >
          {{ $t('action.remove') }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
