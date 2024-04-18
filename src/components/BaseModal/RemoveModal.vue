<script setup lang="ts">
import { ref } from 'vue'
import { VColors, VVariants } from '../../@model/vuetify'
import AppTextarea from '../../@core/components/app-form-elements/AppTextarea.vue'
import BaseModal from '../BaseModal/index.vue'

interface Props {
  entityName?: string
  removeModalId: string
  title?: string
  description?: string
  withRemoveComment?: boolean
  state?: boolean
}

interface OnCLickModalOkPayload {
  hide: Function
  commentToRemove: string
}

interface Emits {
  (event: 'on-click-modal-ok', payload: OnCLickModalOkPayload): void
  (event: 'on-close-modal'): void
}

defineProps<Props>()

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
  >
    <template #default="{ action }">
      <VCardText
        :class="{ 'pb-16': withRemoveComment }"
        class="d-flex flex-column pt-0"
      >
        <span>{{ description || $t(`modal.remove${entityName}.description`) }}</span>
        <AppTextarea
          v-if="withRemoveComment"
          v-model.trim="commentToRemove"
          :label="$t('common.comment')"
          rows="3"
          :placeholder="$t('common.comment')"
        />
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
          :color="VColors.Error"
          @click="onClickModalOk(action.hide)"
        >
          {{ $t('action.remove') }}
        </VBtn>
      </VCardText>
    </template>
  </BaseModal>
</template>
