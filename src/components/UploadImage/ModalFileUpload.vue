<script setup lang="ts">
import { ref } from 'vue'
import { VColors, VVariants } from '../../@model/vuetify'
import FilesUpload from '../FilesUpload/FilesUpload.vue'
import FileGallery from './FileGallery.vue'

const props = defineProps<{
  modelValue: string
  path: string
  file: File
  isLoad: boolean
}>()

const emits = defineEmits<{
  (e: 'upload-files', value: File): void
  (e: 'set-path', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'clear'): void
}>()

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

const onFileUpload = files => {
  emits('upload-files', files)
}
</script>

<template>
  <div class="px-6 pb-6 overflow-hidden tabs-file-upload">
    <VTabs
      v-model="currentTab"
      class="pb-1"
    >
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
          @uploaded-files="onFileUpload"
        >
          <template #content="{ isOverDropZone, openFileDialog }">
            <div
              v-if="isOverDropZone"
              class=""
            >
              <p class="text-body-heading font-weight-bold mb-0">
                {{ $t('uploadImg.dragTextDrop') }}
              </p>
              <p class="font-small-3">
                {{ $t('uploadImg.maxSize') }}
              </p>
            </div>
            <div
              v-else-if="isLoad"
              class="d-flex flex-column justify-center align-center"
            >
              <VProgressCircular
                indeterminate
                :color="VColors.Primary"
                class="mb-1"
              />

              <span class="text-body-heading font-weight-bold">
                {{ $t('common.loading') }}
              </span>
            </div>
            <div
              v-else
              class="text-center"
            >
              <p class="text-body-heading font-weight-bold mb-0">
                {{ $t('uploadImg.dragText') }}
              </p>
              <p class="font-small-3">
                {{ $t('uploadImg.maxSize') }}
              </p>

              <VBtn
                :color="VColors.Primary"
                @click="openFileDialog"
              >
                {{ $t('uploadImg.downloadDevice') }}
              </VBtn>
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
}
</style>
