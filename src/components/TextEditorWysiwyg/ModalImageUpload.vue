<script setup lang="ts">
import FileGallery from '../UploadImage/FileGallery.vue'
import { ModalSizes } from '../../@model/vuetify'
import BaseModal from '../../components/BaseModal/index.vue'

defineProps<{
  modalId: string
}>()

const emits = defineEmits<{
  (e: 'set-path', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'insert', { publicPath, fileName }: { publicPath: string; fileName: string }): void
}>()

const setUrlFile = val => {
  emits('insert', { publicPath: val, fileName: val.split('/')[-1] })
}

const setPathFile = (val: string) => {
  emits('insert', { publicPath: val, fileName: val.split('/')[-1] })
}
</script>

<template>
  <BaseModal
    :id="modalId"
    :title="$t('uploadImg.selectImage')"
    :size="ModalSizes.Medium"
  >
    <div class="px-6 pb-6 tabs-file-upload">
      <FileGallery
        :url-file="modelValue"
        :path="path"
        is-only-gallery
        @input="setUrlFile"
        @input-path="setPathFile"
      />
    </div>
  </BaseModal>
</template>

<style lang="scss">
.tabs-file-upload {
  width: 800px;
  max-height: 600px;
  overflow: auto;

  .scroll-area {
    width: calc(100% + 17px);
  }
}

.tabs-file-upload {
  .img-block {
    position: relative;
    width: 100%;
    height: 13.714rem;
    background: rgba(186, 191, 199, 0.12);
    border-radius: var(--v-border-radius);

    .delete-btn {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
    }
    img {
      height: 100%;
      border-radius: 0.286rem;
    }
  }

  .upload-file {
    height: 16.625rem;

    &.files-upload--over-drop {
      border-style: solid;
      border-color: rgb(var(--v-theme-primary));
      background: rgba(var(--v-theme-primary), 0.08);
    }
  }
}
</style>
