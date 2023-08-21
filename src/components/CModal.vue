<script setup lang="ts">
import { ref } from 'vue'
import i18n from '../libs/i18n'
import { BSize, BSizes, BVariant, BVariants } from '../@model/bootstrap'

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
}

const props = withDefaults(defineProps<CModalProps>(), {
  size: BSizes.Sm,
  okVariant: BVariants.Primary,
  okTitle: i18n.t('action.save') as string,
  cancelVariant: BVariants.OutlineSecondary,
  cancelTitle: i18n.t('action.cancel') as string,
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
    body-class="p-2"
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
    <template #default="{ hide }">
      <slot :hide="hide" />
    </template>

    <template #modal-footer="{ hide }">
      <slot name="modal-footer" :hide="hide" />
    </template>
  </b-modal>
</template>
