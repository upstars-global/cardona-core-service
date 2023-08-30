<script lang="ts">
export default {
  name: 'UploadFile',
}
</script>
<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import useToastService from '../../helpers/toasts'
import { BSize } from '../../@model/bootstrap'
import i18n from '../../libs/i18n'

type Props = {
  size?: BSize
  textBtn?: string
  dropPlaceholder?: string
  isRequired?: boolean
  disabled?: boolean
  accept?: string
  acceptTitle?: string
  onSubmitCallback?: (file: File) => void
  maxSizeFileMb?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: BSize.Sm,
  textBtn: i18n.t('uploadFile.textBtn') as string,
  dropPlaceholder: i18n.t('uploadFile.dragTextDrop') as string,
  accept: 'application/json',
  acceptTitle: 'JSON',
  maxSizeFileMb: 10,
})

const kbsInMb = 1048576 //1MB
const isLoad = ref(false)
const { toastError } = useToastService()
const file = ref()

const clearFile = () => {
  file.value = null

  //It is necessary for the work of the watcher inside when re-deleting
  nextTick(() => {
    file.value = undefined
  })
}

watch(file, async (file: File) => {
  await onUploadFile(file)
})

const maxSizeFileKB = computed(() => props.maxSizeFileMb * kbsInMb)

const fileSizeFormatted = computed(() => (maxSizeFileKB.value / kbsInMb).toString())

const onUploadFile = async (file: File) => {
  if (file) {
    if (file.size > maxSizeFileKB.value) {
      clearFile()

      toastError('fileSizeError', { MB: fileSizeFormatted.value })

      return
    }

    try {
      isLoad.value = true

      if (props.onSubmitCallback) await props.onSubmitCallback(file)
      await clearFile()
    } catch {
      await clearFile()
    } finally {
      isLoad.value = false
    }
  }
}
</script>

<template>
  <div class="form-upload-file form-group mb-2" :class="{ 'form-required': isRequired, disabled }">
    <div class="img-file-block" :class="size">
      <div
        v-if="isLoad"
        class="d-flex flex-column h-100 w-100 justify-content-center align-items-center block-load-img"
      >
        <b-spinner variant="primary" class="mb-1" />

        <p class="text-body-heading font-weight-bold mb-0">
          {{ $t('common.loading') }}
        </p>
      </div>
      <div
        v-else
        class="btn-open-modal-block d-flex align-items-center justify-content-center pointer-events-none"
      >
        <h5 class="mb-50">{{ $t('uploadFile.dropFile') }}</h5>
        <p class="mb-50">
          {{ $t('uploadFile.fileParams', { accept: acceptTitle, size: fileSizeFormatted }) }}
        </p>
        <b-button variant="outline-secondary" size="sm" class="btn-open-modal pointer-events-none">
          <span class="white-space-nowrap">
            {{ textBtn }}
          </span>
        </b-button>
      </div>

      <b-form-file
        v-model="file"
        :drop-placeholder="dropPlaceholder"
        placeholder=""
        :accept="accept"
      />
    </div>
  </div>
</template>

<style lang="scss">
@import '../../assets/scss/components/upload';
</style>