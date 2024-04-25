<script setup lang="ts">
import { ref } from 'vue'
import i18n from '../libs/i18n'
import { BSize, BVariant } from '../@model/bootstrap'

type CModalProps = {
  id: string
  title: string
  size?: BSize
  hideFooter?: boolean
  okVariant?: BVariant
  okTitle?: string
  okDisabled?: boolean
  cancelVariant?: BVariant
  cancelTitle?: string
  noCloseOnBackdrop?: boolean
  lazy?: boolean
  bodyClass?: string
}

const props = withDefaults(defineProps<CModalProps>(), {
  size: BSize.Sm,
  okVariant: BVariant.Primary,
  okTitle: i18n.t('action.save') as string,
  cancelVariant: BVariant.OutlineSecondary,
  cancelTitle: i18n.t('action.cancel') as string,
  bodyClass: 'p-2',
})

const emit = defineEmits<{
  (event: 'ok', hide: Function): void
  (event: 'hidden'): void
  (event: 'show'): void
}>()

const refModal: any = ref(null)

const onClickOk = () => emit('ok', refModal.value.hide)
const onHidden = () => emit('hidden')
const onShow = () => emit('show')
</script>

<template>
  <b-modal
    :id="id"
    ref="refModal"
    :title="title"
    :size="size"
    centered
    :lazy="lazy"
    :body-class="bodyClass"
    :no-close-on-backdrop="noCloseOnBackdrop"
    :hide-footer="hideFooter"
    :ok-variant="okVariant"
    :ok-title="okTitle"
    :ok-disabled="okDisabled"
    :cancel-variant="cancelVariant"
    :cancel-title="cancelTitle"
    @ok.prevent="onClickOk"
    @hidden="onHidden"
    @show="onShow"
  >
    <template #modal-header="{ hide }">
      <slot name="modal-header" :hide="hide" :title="title" />
    </template>

    <template #default="{ hide }">
      <slot :hide="hide" />
    </template>

    <template #modal-footer="{ hide }">
      <slot name="modal-footer" :hide="hide" />
    </template>
  </b-modal>
</template>
