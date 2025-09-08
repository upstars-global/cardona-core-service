<script setup lang="ts">
import { useStore } from 'vuex'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'
import FileUpload from '../../components/FilesUpload/FilesUpload.vue'
import BaseModal from '../BaseModal/index.vue'
import { ModalsIds } from '../../@model/enums/modal'
import { useVideoUploadStore } from '../../stores/uploadVideo'

defineOptions({
  name: 'ModalVideoUpload',
})

const { getters } = useStore()
const videoUploadStore = useVideoUploadStore()

const setFile = (file: File) => {
  const params = {
    name: file.name,
    description: file.name,
    size: file.size,
    project: getters.selectedProject?.alias,
  }

  videoUploadStore.upload(params)
  console.log(file)
}

const fileMaxSize = 100 * 1024 // 100 MB
const ACCEPT_TITLE = 'MP4'

const SUPPORTED_VIDEO_FORMATS: string[] = [
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/mpeg',
  'video/ogg',
  'video/webm',
  'video/x-flv',
  'application/octet-stream',
]
</script>

<template>
  <BaseModal :id="ModalsIds.UploadVideo">
    <FileUpload
      :on-submit-callback="setFile"
      :size="UploadFileSizes.md"
      :max-size-file-mb="fileMaxSize"
      :text-btn="$t('uploadFile.textBtn')"
      class="file-upload"
      :data-types="SUPPORTED_VIDEO_FORMATS"
      :is-error="false"
    >
      <template #content="{ fileSizeFormatted }">
        <p class="mb-0 text-body-1 font-weight-medium text-medium-emphasis">
          {{ $t('uploadFile.dropFile') }}
        </p>
        <p class="mb-0 text-body-1 text-medium-emphasis text-body-2">
          {{ $t('uploadFile.fileParams', { accept: ACCEPT_TITLE, size: fileSizeFormatted }) }}
        </p>
      </template>
    </FileUpload>
  </BaseModal>
</template>
