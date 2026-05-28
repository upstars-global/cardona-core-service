<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { ListSize } from '../../../../../@model/templates/tableFields'
import type { EmitEvents } from '../../../../../@model'
import ImageField from './ImageField.vue'

const props = withDefaults(defineProps<{
  id: string
  imagePath: string
  compressionForPreview?: number
  size?: ListSize
}>(), {
  size: ListSize.MD,
})

const emit = defineEmits<EmitEvents<{
  'show-modal': string
}>>()

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)

const clickImage = () => {
  emit('show-modal', props.imagePath)
}
</script>

<template>
  <div
    v-if="imagePath"
    :key="id"
    class="d-flex justify-content-center align-center image-detail-field"
  >
    <ImageField
      :image-path="previewImage"
      :size="size"
      @click.stop="clickImage"
    />
  </div>
</template>
