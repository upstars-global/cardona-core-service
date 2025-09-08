<script setup lang="ts">
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'
import FileUpload from '../../components/FilesUpload/FilesUpload.vue'
import BaseModal from '../BaseModal/index.vue'
import { ModalsIds } from '../../@model/enums/modal'

defineOptions({
  name: 'ModalVideoUpload',
})

const setFile = (file: File) => {
  console.log(file)
}

const fileMaxSize = 100 * 1024 // 100 MB
const ACCEPT_TITLE = 'MP4'

const SUPPORTED_VIDEO_FORMATS: string[] = [
  'video/mp4', // .mp4 (H.264 + AAC) — найширше підтримується
  'video/webm', // .webm (VP8/VP9 + Vorbis/Opus) — добре підтримується в сучасних браузерах
  'video/ogg', // .ogv (Theora + Vorbis) — менш популярний, але ще підтримується
  'video/x-matroska', // .mkv — частково підтримується (наприклад, Chrome, Firefox)
  'video/quicktime', // .mov — частково підтримується (особливо в Safari)
  'video/3gpp', // .3gp — підтримується на мобільних пристроях
  'video/x-msvideo', // .avi — підтримка обмежена (не рекомендовано)
  'application/vnd.apple.mpegurl', // .m3u8 (HLS) — підтримується Safari, частково Chrome (через MediaSource)
  'video/mp2t', // .ts (Transport Stream — використовується в HLS)
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
