<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core'
import { computed, ref } from 'vue'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'
import useToastService from '../../helpers/toasts'
import { VColors, VSizes, VVariants } from '../../@model/vuetify'

interface Props {
  size: UploadFileSizes
  disabled: boolean
  dataTypes: string[]
  maxSizeFileMb: number
  onSubmitCallback?: Function
  onBtnClickCallback?: Function
  textBtn: string
}

const props = withDefaults(defineProps<Props>(), {
  size: UploadFileSizes.md,
  disabled: false,
  dataTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'],
  maxSizeFileMb: 10,
  textBtn: 'Upload file',
})

const emits = defineEmits<{
  uploadedFiles: [files: any]
}>()

const { toastError } = useToastService()
const dropZoneRef = ref<HTMLDivElement>()
const kbsInMb = 1048576 // 1MB
const maxSizeFileKB = computed(() => props.maxSizeFileMb * kbsInMb)
const fileSizeFormatted = computed(() => (maxSizeFileKB.value / kbsInMb).toString())
const isLoading = ref(false)
const isLoadingError = ref(false)

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
  if (files && files.length) {
    const file = files[0]
    if (file.size > maxSizeFileKB.value) {
      toastError('fileSizeError', { MB: fileSizeFormatted.value })
      isLoadingError.value = true

      return
    }

    try {
      isLoading.value = true
      if (props.onSubmitCallback)
        await props.onSubmitCallback(file)
    }
    catch {
      isLoadingError.value = true
    }
    finally {
      isLoading.value = false
    }
  }
}

const { isOverDropZone } = useDropZone(dropZoneRef, { onDrop, dataTypes: props.dataTypes })
</script>

<template>
  <div
    ref="dropZoneRef"
    class="files-upload d-flex align-center justify-center"
    :class="[props.size, { 'files-upload--over-drop': isOverDropZone, disabled }]"
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
        <p class="text-body-heading font-weight-bold mb-0">
          {{ $t('common.loading') }}
        </p>
      </div>
      <div
        v-else
        class="btn-open-modal-block d-flex flex-column gap-2 align-center justify-center text-center"
      >
        <slot
          name="content"
          :is-over-drop-zone="isOverDropZone"
          :open-file-dialog="open"
          :file-size-formatted="fileSizeFormatted"
        />
        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Secondary"
          :size="VSizes.Small"
          :disabled="disabled"
          @click="onClickBtn"
        >
          <span class="white-space-nowrap">
            {{ textBtn }}
          </span>
        </VBtn>
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
</style>
