<script setup lang="ts">
import { ref } from 'vue'
import { VColors, VVariants } from '../../@model/vuetify'
import FilesUpload from '../FilesUpload/FilesUpload.vue'
import { IconsList } from '.././../@model/enums/icons'
import FileGallery from './FileGallery.vue'

defineProps<{
  modelValue: string
  path: string
  file: File
  isLoad: boolean
  onUploadImageCb: Function
}>()

const emits = defineEmits<{
  (e: 'upload-files', value: File): void
  (e: 'set-path', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

const maxSizeMb = 4

const setUrlFile = val => {
  emits('update:modelValue', val)
}

const setPathFile = (val: string) => {
  emits('set-path', val)
}

const clearFile = () => {
  emits('clear')
}

const tabs = {
  new: 'new',
  selectImage: 'selectImage',
}

const currentTab = ref(tabs.new)
</script>

<template>
  <div class="px-6 pb-6 overflow-hidden tabs-file-upload">
    <VTabs v-model="currentTab">
      <VTab :value="tabs.new">
        {{ $t('uploadImg.downloadNew') }}
      </VTab>
      <VTab :value="tabs.selectImage">
        {{ $t('uploadImg.chooseFromDownloaded') }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="currentTab"
      class="mt-5"
    >
      <VWindowItem :value="tabs.new">
        <div
          v-if="modelValue"
          class="pa-6 img-block"
        >
          <VBtn
            class="delete-btn"
            :variant="VVariants.Outlined"
            :color="VColors.Error"
            @click="clearFile"
          >
            {{ $t('uploadImg.delete') }}
          </VBtn>

          <img :src="modelValue">
        </div>
        <FilesUpload
          v-else
          :max-size-file-mb="maxSizeMb"
          :on-submit-callback="onUploadImageCb"
          class="upload-file"
        >
          <template #default="{ isOverDropZone, openFileDialog, isLoading, isLoadingError }">
            <div v-if="isOverDropZone">
              <p class="text-body-1 font-weight-medium mb-0">
                {{ $t('uploadImg.dragTextDrop') }}
              </p>
              <p class="text-body-1">
                {{ $t('uploadImg.maxSize', { size: maxSizeMb }) }}
              </p>
            </div>
            <div
              v-else-if="isLoading"
              class="d-flex flex-column justify-center align-center"
            >
              <VProgressCircular
                indeterminate
                :color="VColors.Primary"
                class="mb-1"
              />
              <span class="text-body-1 font-weight-medium">
                {{ $t('common.loading') }}
              </span>
            </div>
            <div
              v-else
              class="text-center"
            >
              <template v-if="isLoadingError">
                <VIcon
                  :icon="IconsList.AlertCircleIcon"
                  size="32"
                  class="text-error mb-4"
                />
                <p class="text-error text-body-1 mb-4">
                  {{ $t('uploadImg.loadError') }}
                </p>
                <VBtn
                  :color="VColors.Primary"
                  @click="openFileDialog"
                >
                  {{ $t('action.repeat') }}
                </VBtn>
              </template>
              <template v-else>
                <p class="text-body-1 font-weight-medium mb-0">
                  {{ $t('uploadImg.dragText') }}
                </p>
                <p class="text-body-1">
                  {{ $t('uploadImg.maxSize', { size: maxSizeMb }) }}
                </p>
                <VBtn
                  :color="VColors.Primary"
                  @click="openFileDialog"
                >
                  {{ $t('uploadImg.uploadFromDevice') }}
                </VBtn>
              </template>
            </div>
          </template>
        </FilesUpload>
      </VWindowItem>
      <VWindowItem :value="tabs.selectImage">
        <FileGallery
          :url-file="modelValue"
          :path="path"
          @input="setUrlFile"
          @input-path="setPathFile"
        />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<style lang="scss">
.tabs-file-upload {
 width: 800px;
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
