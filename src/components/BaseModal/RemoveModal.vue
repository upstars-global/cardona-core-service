<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { VColors, VVariants } from '../../@model/vuetify'
import AppTextarea from '../../@core/components/app-form-elements/AppTextarea.vue'
import BaseModal from '../BaseModal/index.vue'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'
import ModalFooter from './ModalFooter.vue'

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

const localizedEntityName = computed(() => te(`entities.${props.entityName}`) ? t(`entities.${props.entityName}`).toLowerCase() : '')

const modalTitle = computed(() => {
  const localeKey = `modal.remove${props.entityName}.title`

  const translatedTitle = localizedEntityName.value
    ? t('modal.remove.title', { entityName: localizedEntityName.value })
    : te(localeKey)
      ? t(localeKey)
      : ''

  return props.title || translatedTitle
})

const modalDescription = computed(() => {
  if (props.description)
    return props.description

  return localizedEntityName.value
    ? t('modal.remove.description', { entityName: localizedEntityName.value })
    : t(`modal.remove${props.entityName}.description`)
})
</script>

<template>
  <BaseModal
    :id="removeModalId"
    :title="modalTitle"
    @hide="$emit('on-close-modal')"
  >
    <template #default="{ action }: BaseModalDefaultPropsOfSlot">
      <div class="d-flex flex-column">
        <span
          class="text-body-1"
          data-test-id="modal-description"
        >{{ modalDescription }}</span>
        <AppTextarea
          v-if="withRemoveComment"
          v-model.trim="commentToRemove"
          class="mt-6"
          :label="$t('common.comment')"
          data-test-id="comment-to-remove"
          rows="3"
          :placeholder="$t('common.comment')"
        />
      </div>
    </template>
    <template #modal-footer="{ action } : BaseModalDefaultPropsOfSlot">
      <ModalFooter
        :cancel="{
          label: $t('action.cancel'),
        }"
        :accept="{
          color: VColors.Error,
          label: $t('action.remove'),
        }"
        @on-cancel="onCloseModal(action.hide)"
        @on-accept="onClickModalOk(action.hide)"
      />
    </template>
  </BaseModal>
</template>
