<script setup lang="ts">
import { computed } from 'vue'
import { type TranslateResult } from 'vue-i18n'
import { ModalSizes, VColors } from '../../@model/vuetify'
import type { BaseModalDefaultPropsOfSlot } from '../../@model/modal'
import { useLoaderStore } from '../../stores/loader'
import BaseModal from './index.vue'
import ModalFooter from './ModalFooter.vue'

const props = withDefaults(defineProps<{
  modalId: string
  title: TranslateResult
  description: TranslateResult
  actionBtnText: TranslateResult
  actionBtnColor: VColors
  loadingUrls?: string[] | string
}>(), {
  actionBtnColor: VColors.Error,
})

defineEmits<{
  confirmed: { payload: unknown; hide: Function } | [CallableFunction]
}>()

const loaderStore = useLoaderStore()

const isLoading = computed(() => props?.loadingUrls ? loaderStore.isLoadingEndpoint(props?.loadingUrls) : false)
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
    <template #modal-footer="{ action, payload = '' } : BaseModalDefaultPropsOfSlot">
      <ModalFooter
        :cancel="{
          label: $t('action.cancel'),
        }"
        :accept="{
          color: actionBtnColor,
          label: actionBtnText,
          disabled: isLoading,
          loading: isLoading,
        }"
        @on-cancel="action.hide"
        @on-accept="$emit('confirmed', payload ? { payload, hide: action.hide } : action.hide)"
      />
    </template>
  </BaseModal>
</template>
