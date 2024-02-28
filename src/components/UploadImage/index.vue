<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue'
import useToastService from '../../helpers/toasts'
import store from '../../store'
import { IconsList } from '../../@model/enums/icons'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'
import { i18n } from '../../plugins/i18n'
import BaseModal from '../../components/BaseModal/index.vue'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'

interface Props {
  size: UploadFileSizes
  label: string
  type: string
  textBtn: string
  dropPlaceholder: string
  isRequired: boolean
  modelValue: string
  path: string
  disabled: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: UploadFileSizes.md,
  label: i18n.t('uploadImg.label'),
  type: 'banners',
  textBtn: i18n.t('uploadImg.textBtn'),
  dropPlaceholder: i18n.t('placeholder.dropFile'),
  isRequired: false,
  value: '',
  path: '',
  disabled: false,
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input-path', value: string): void
}>()

const modal = inject('modal')

const maxSizeFileKB = 4194304 // 4MB
const isLoading = ref(false)
const { toastError } = useToastService()
const file = ref()

const urlFile = computed({
  get: () => props.modelValue,
  set: value => emits('update:modelValue', value),
})

const clearFile = ({ hide }) => {
  emits('input-path', '')
  emits('update:modelValue', '')
  file.value = null
  if (hide)
    hide()

  // It is necessary for the work of the watcher inside when re-deleting
  nextTick(() => {
    file.value = undefined
  })
}

const onSetPath = val => {
  emits('input-path', val)
}

const removeModalId = 'image-item-remove-modal'
const selectModalId = 'image-item-select-modal'

// Remove
const onClickRemove = async () => {
  modal.showModal(removeModalId)
}

const openSelectModal = () => {
  modal.showModal(selectModalId)
}

const onFileUpload = async files => {
  if (files.length) {
    const file = files[0]
    if (file.size > maxSizeFileKB) {
      clearFile()

      toastError('fileSizeError', { MB: String(maxSizeFileKB / 1048576) })

      return
    }

    try {
      isLoading.value = true

      const _path = `${props.path}/${file.name.replace(/\W/g, '_')}`

      const { publicPath } = await store.dispatch('compostelaCore/uploadFile', {
        file,
        path: _path,
      })

      urlFile.value = publicPath
      emits('input-path', _path)
    }
    catch {
      await clearFile()
    }
    finally {
      isLoading.value = false
    }
  }
  else {
    emits('update:modelValue', '')
    emits('input-path', '')
  }
}
</script>

<template>
  <div
    v-if="urlFile"
    class="img-file-block-inner d-flex justify-center align-center"
  >
    <div
      class="img-file"
      :style="{ backgroundImage: `url(${urlFile})` }"
    />
    <div class="img-file-block-inner__actions d-flex gap-3">
      <VBtn
        :size="VSizes.Small"
        :color="VColors.Secondary"
        :icon="IconsList.UploadIcon"
        rounded="sm"
        @click="openSelectModal"
      />
      <VBtn
        :color="VColors.Error"
        class="btn-icon"
        :size="VSizes.Small"
        :icon="IconsList.Trash2Icon"
        rounded="sm"
        @click="onClickRemove"
      />
    </div>
  </div>
  <FilesUpload
    v-else
    @uploaded-files="onFileUpload"
  >
    <template #content="{ isOverDropZone }">
      <p v-if="isOverDropZone">
        {{ $t('placeholder.dropFile') }}
      </p>
      <div
        v-else-if="isLoading"
        class="d-flex flex-column justify-center align-center"
      >
        <VProgressCircular
          indeterminate
          :color="VColors.Primary"
          class="mb-1"
        />
        <p class="text-body-heading font-weight-bold mb-0">
          {{ $t('common.loading') }}
        </p>
      </div>
      <div
        v-else
        class="btn-open-modal-block d-flex align-items-center justify-content-center"
      >
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          @click="openSelectModal"
        >
          <span class="white-space-nowrap">
            {{ textBtn }}
          </span>
        </VBtn>
      </div>
    </template>
  </FilesUpload>
  <BaseModal
    :id="selectModalId"
    :title="$t('uploadImg.selectImage')"
    size="md"
  >
    <ModalFileUpload
      v-model="urlFile"
      :path="path"
      :file="file"
      :is-load="isLoading"
      @upload-files="onFileUpload"
      @set-path="onSetPath"
      @clear="onClickRemove"
    />
  </BaseModal>
  <RemoveModal
    :remove-modal-id="removeModalId"
    :title="$t(`uploadImg.modalTitle.${props.type}`)"
    :description="$t(`uploadImg.modalLabel.${props.type}`)"
    @on-click-modal-ok="clearFile"
  />
</template>

<style lang="scss">
@import '../../assets/styles/components/upload';

.img-file-block-inner {
  position: relative;
  width: 100%;
  height: 7.625rem;
  max-height: 100%;
  border: 1px solid transparent;

  .img-file {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: var(--v-border-radius);
    background-size: cover;
    background-position: center;
  }

  &__actions {
    position: relative;
    z-index: 1;
  }
}
</style>
