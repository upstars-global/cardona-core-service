<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VColors, VVariants } from '../../@model/vuetify'
import AppTextarea from '../../@core/components/app-form-elements/AppTextarea.vue'
import BaseModal from '../BaseModal/index.vue'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'

const props = withDefaults(defineProps<Props>(), {
  removeBtnColor: VColors.Error,
  removeBtnVariant: VVariants.Flat,
  cancelBtnColor: VColors.Secondary,
  cancelBtnVariant: VVariants.Outlined,
})

const emits = defineEmits<Emits>()

const { t, te } = useI18n()

interface Props {
  entityName?: string
  removeModalId: string
  title?: string
  description?: string
  withRemoveComment?: boolean
  removeBtnColor?: VColors
  removeBtnVariant?: VVariants
  cancelBtnColor?: VColors
  cancelBtnVariant?: VVariants
}

interface OnCLickModalOkPayload {
  hide: Function
  commentToRemove: string
}

interface Emits {
  (event: 'on-click-modal-ok', payload: OnCLickModalOkPayload): void
  (event: 'on-close-modal'): void
}

const commentToRemove = ref()

const onClickModalOk = async (hide: Function) => {
  emits('on-click-modal-ok', { hide, commentToRemove: commentToRemove.value })
}

const onCloseModal = (hide: Function) => {
  emits('on-close-modal')
  hide()
}

const modalTitle = computed(() => {
  const localeKey = `modal.remove${props.entityName}.title`
  const translatedTitle = te(localeKey) ? t(localeKey) : ''

  return props.title || translatedTitle
})
</script>

<template>
  <BaseModal
    :id="removeModalId"
    :title="modalTitle"
    @hide="$emit('on-close-modal')"
  >
    <template #default="{ action }: BaseModalDefaultPropsOfSlot">
      <VCardText class="d-flex flex-column py-6">
        <span
          class="text-body-1"
          data-test-id="modal-description"
        >{{ description || $t(`modal.remove${entityName}.description`) }}</span>
        <AppTextarea
          v-if="withRemoveComment"
          v-model.trim="commentToRemove"
          :label="$t('common.comment')"
          data-test-id="comment-to-remove"
          rows="3"
          :placeholder="$t('common.comment')"
        />
      </VCardText>
      <hr class="ma-0">
      <VCardText class="d-flex justify-end gap-3 flex-wrap py-4">
        <VBtn
          :color="cancelBtnColor"
          :variant="cancelBtnVariant"
          data-test-id="btn-cancel"
          @click="onCloseModal(action.hide)"
        >
          {{ $t('action.cancel') }}
        </VBtn>
        <VBtn
          :color="removeBtnColor"
          :variant="removeBtnVariant"
          data-test-id="btn-remove"
          @click="onClickModalOk(action.hide)"
        >
          {{ $t('action.remove') }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
