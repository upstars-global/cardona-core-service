<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue'
import { Field } from 'vee-validate'
import store from '../../store'
import { IconsList } from '../../@model/enums/icons'
import { ModalSizes, VColors, VSizes, VVariants } from '../../@model/vuetify'
import { i18n } from '../../plugins/i18n'
import BaseModal from '../../components/BaseModal/index.vue'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'
import RemoveModal from '../../components/BaseModal/RemoveModal.vue'
import FilesUpload from '../FilesUpload/FilesUpload.vue'
import { MAX_WIDTH_TOOLTIP } from '../../utils/constants'
import { ModalsId } from '../../@model/modalsId'
import ModalFileUpload from './ModalFileUpload.vue'

interface FieldConfig {
  id: string
  rules: Record<string, unknown>
  label?: string
  name: string
}

interface Props {
  size?: UploadFileSizes
  label?: string
  type?: string
  textBtn?: string
  dropPlaceholder?: string
  modelValue?: string
  path?: string
  disabled?: boolean
  modalId?: string
  field?: FieldConfig
}

const props = withDefaults(defineProps<Props>(), {
  size: UploadFileSizes.md,
  label: i18n.t('uploadImg.label'),
  type: 'banners',
  textBtn: i18n.t('uploadImg.textBtn'),
  dropPlaceholder: i18n.t('placeholder.dropFile'),
  value: '',
  path: '',
  disabled: false,
  modalId: ModalsId.UploadImage,
  field: () => ({
    id: '',
    rules: {},
    label: '',
    name: '',
  }),
})

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input-path', value: string): void
}>()

const modal = inject('modal')

const maxSizeFileMb = 4 // 4MB
const file = ref()

const urlFile = computed({
  get: () => props.modelValue,
  set: value => {
    if (value)
      modal.hideModal(selectModalId)

    emits('update:modelValue', value)
  },
})

const clearFile = actions => {
  emits('input-path', '')
  emits('update:modelValue', '')
  file.value = null
  if (actions?.hide)
    actions.hide()

  // It is necessary for the work of the watcher inside when re-deleting
  nextTick(() => {
    file.value = undefined
  })
}

const onSetPath = val => {
  emits('input-path', val)
}

const removeModalId = `${props.modalId}-remove-modal`
const selectModalId = `${props.modalId}-select-modal`

// Remove
const onClickRemove = async () => {
  modal.showModal(removeModalId)
}

const openSelectModal = () => {
  modal.showModal(selectModalId)
}

const onFileUpload = async file => {
  try {
    const _path = `${props.path}/${file.name.replace(/\W/g, '_')}`

    const { publicPath } = await store.dispatch('compostelaCore/uploadFile', {
      file,
      path: _path,
    })

    urlFile.value = publicPath
    emits('input-path', _path)
  }
  catch (error) {
    await clearFile()
    throw error
  }
}

const isRequired = computed(() => !!props.field.rules?.required)
</script>

<template>
  <Field
    v-model="urlFile"
    :name="field.id"
    :label="field.label.toLowerCase()"
    :rules="field.rules"
    :validate-on-blur="false"
    :validate-on-change="false"
    :validate-on-input="false"
    :validate-on-model-update="true"
  >
    <template #default="{ errorMessage }">
      <div :id="`${field.id}-field`">
        <VLabel
          class="mb-1 field-generator-label text-body-2 text-high-emphasis justify-between"
          :class="{ 'field-generator-label--required': isRequired }"
        >
          {{ label }}
        </VLabel>
        <div
          v-if="urlFile"
          class="img-file-block-inner d-flex justify-center align-center"
          :class="{ disabled }"
        >
          <div
            class="img-file"
            :style="{ backgroundImage: `url(${urlFile})` }"
          />
          <div
            class="img-file-block-inner__actions gap-3"
            :class="{ 'd-none': disabled, 'd-flex': !disabled }"
          >
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
          :text-btn="textBtn"
          :on-submit-callback="onFileUpload"
          :max-size-file-mb="maxSizeFileMb"
          :on-btn-click-callback="openSelectModal"
          :disabled="disabled"
          :is-error="errorMessage"
        />
        <BaseModal
          :id="selectModalId"
          :title="$t('uploadImg.selectImage')"
          :size="ModalSizes.Medium"
          modal-body-class="pa-6 pt-0"
          width="850px"
        >
          <template #modal-header="{ title }">
            <div class="d-flex align-center">
              <h5 class="mb-0 text-h5">
                {{ title }}
              </h5>
              <VTooltip
                :text="$t('uploadImg.selectImageTooltip')"
                :max-width="MAX_WIDTH_TOOLTIP"
                class="text-body-1"
              >
                <template #activator="{ props }">
                  <VIcon
                    :icon="IconsList.InfoIcon"
                    v-bind="props"
                    class="ml-2 align-text-top text-grey-500"
                  />
                </template>
              </VTooltip>
            </div>
          </template>
          <template #default>
            <div class="transaction-modal-content--wrapper overflow-y-auto overflow-x-hidden">
              <ModalFileUpload
                v-model="urlFile"
                :path="path"
                :file="file"
                :on-upload-image-cb="onFileUpload"
                @set-path="onSetPath"
                @clear="onClickRemove"
              />
            </div>
          </template>
        </BaseModal>
        <RemoveModal
          :remove-modal-id="removeModalId"
          :title="$t(`uploadImg.modalTitle.${props.type}`)"
          :description="$t(`uploadImg.modalLabel.${props.type}`)"
          :remove-btn-variant="VVariants.Outlined"
          :cancel-btn-color="VColors.Primary"
          :cancel-btn-variant="VVariants.Flat"
          @on-click-modal-ok="clearFile"
        />
      </div>
      <span class="error-message text-caption text-error mt-1">{{ errorMessage }}</span>
    </template>
  </Field>
</template>

<style lang="scss">
@import '../../assets/styles/components/upload';

.field-generator-label {

  &--required:after {
    content: "*";
    color: rgb(var(--v-theme-error));
    margin-left: 0.25rem;
  }
}

.transaction-modal-content--wrapper {
  max-height: 90vh;
}
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
    opacity: 0;
    transition-property: opacity;
    transition-duration: 0.3s;
  }
  &:hover {
    .img-file-block-inner__actions {
      opacity: 1;
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.3;
  }
}
</style>
