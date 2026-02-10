<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core'
import { computed, ref } from 'vue'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'
import useToastService from '../../helpers/toasts'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'

interface Props {
  size?: UploadFileSizes
  wrapperClass: string
  disabled?: boolean
  dataTypes?: string[]
  maxSizeFileMb?: number
  onSubmitCallback?: Function
  onBtnClickCallback?: Function
  multiple?: boolean
  textBtn: string
  btnUpload?: {
    color: VColors
    variant: VVariants
    size: VSizes
  }
  isError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: UploadFileSizes.md,
  wrapperClass: '',
  disabled: false,
  dataTypes: () => ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
  maxSizeFileMb: 10,
  textBtn: 'Upload file',
  btnUpload: {
    color: VColors.Secondary,
    variant: VVariants.Outlined,
    size: VSizes.Small,
  },
})

defineEmits<{
  uploadedFiles: [files: File]
}>()

const { toastError } = useToastService()
const dropZoneRef = ref<HTMLDivElement>()
const kbsInMb = 1048576 // 1MB
const maxSizeFileKB = computed(() => props.maxSizeFileMb * kbsInMb)
const fileSizeFormatted = computed(() => (maxSizeFileKB.value / kbsInMb).toString())
const isLoading = ref(false)
const isLoadingError = ref(false)
const isMultiple = computed(() => props.multiple)

const { open, onChange } = useFileDialog({
  accept: props.dataTypes.join(','),
  reset: true,
})

const onClickBtn = () => {
  if (props.onBtnClickCallback)
    props.onBtnClickCallback()
  else
    open()
}

onChange(items => {
  if (items?.length)
    onDrop(items)
})
async function onDrop(files: File[] | null) {
  if (!files?.length)
    return

  const filesToProcess = isMultiple.value ? Array.from(files) : [files[0]]

  const validFiles = filesToProcess.filter(file => {
    const isValid = file.size <= maxSizeFileKB.value
    if (!isValid)
      toastError('fileSizeError', { MB: fileSizeFormatted.value })

    return isValid
  })

  if (!validFiles.length) {
    isLoadingError.value = true

    return
  }

  const payload = isMultiple.value ? validFiles : validFiles[0]

  try {
    isLoading.value = true
    await props.onSubmitCallback?.(payload)
  }
  catch {
    isLoadingError.value = true
  }
  finally {
    isLoading.value = false
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop, dataTypes: props.dataTypes })
</script>

<template>
  <div
    ref="dropZoneRef"
    class="files-upload d-flex align-center justify-center text-medium-emphasis"
    :class="[props.size, wrapperClass, { 'files-upload--over-drop': isOverDropZone, disabled, 'error': isError }]"
    @dragover.prevent
    @drop.prevent
  >
    <slot
      name="default"
      :is-over-drop-zone="isOverDropZone"
      :open-file-dialog="open"
      :is-loading="isLoading"
      :is-loading-error="isLoadingError"
    >
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
        <p class="text-body-1 mb-0">
          {{ $t('common.loading') }}
        </p>
      </div>
      <div
        v-else
        class="btn-open-modal-block d-flex flex-column gap-2 align-center justify-center text-center w-100"
      >
        <slot
          name="content"
          :is-over-drop-zone="isOverDropZone"
          :open-file-dialog="open"
          :file-size-formatted="fileSizeFormatted"
        />
        <slot
          name="upload-btn"
          :actions="{ onClickBtn }"
        >
          <VBtn
            :variant="btnUpload.variant"
            :color="btnUpload.color"
            :size="btnUpload.size"
            :disabled="disabled"
            @click="onClickBtn"
          >
            <span class="white-space-nowrap">
              {{ textBtn }}
            </span>
          </VBtn>
        </slot>
      </div>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.files-upload {
  border-radius: 6px;
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  &:hover {
    border-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  }

  &--over-drop {
    border-color: rgb(var(--v-theme-primary));
    border-style: solid;
    background: rgba(var(--v-theme-primary), var(--v-selected-opacity));
  }

  &.sm {
    width: 7.625rem;
    min-height: 7.625rem;

  }
  &.md {
    width: 100%;
    min-height: 7.625rem;
  }

  &.disabled {
    border-color: rgba(var(--v-theme-grey-300));
    pointer-events: none;
  }
}

.error {
  border-color: rgba(var(--v-theme-error));
}
</style>
