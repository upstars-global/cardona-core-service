<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core'
import { ref } from 'vue'
import { UploadFileSizes } from '../../@model/enums/uploadFileSizes'

interface Props {
  size: UploadFileSizes
  disabled: boolean
  accept: string
}

const props = withDefaults(defineProps<Props>(), {
  size: UploadFileSizes.md,
  disabled: false,
  accept: 'image/*',
})

const emits = defineEmits<{
  uploadedFiles: [files: any]
}>()

const dropZoneRef = ref<HTMLDivElement>()

const { open, onChange } = useFileDialog({
  accept: props.accept,
  reset: true,
})

onChange(items => {
  emits('uploadedFiles', items)
})
function onDrop(files: File[] | null) {
  if (files)
    emits('uploadedFiles', files)
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)
</script>

<template>
  <div
    ref="dropZoneRef"
    class="files-upload d-flex align-center justify-center"
    :class="[props.size]"
  >
    <slot
      name="content"
      :is-over-drop-zone="isOverDropZone"
      :open-file-dialog="open"
    />
  </div>
</template>

<style scoped lang="scss">
.files-upload {
  border-radius: 6px;
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.25);
  &:hover {
    border-color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  }

  &.sm {
    width: 7.625rem;
    height: 7.625rem;

  }
  &.md {
    width: 100%;
    height: 7.625rem;
  }
}
</style>
