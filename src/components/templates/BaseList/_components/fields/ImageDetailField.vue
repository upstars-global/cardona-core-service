<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { VSizes } from 'cardona-core-service/src/@model/vuetify'
import BaseModal from '../../../../BaseModal/index.vue'
import { ModalSizes } from '../../../../../@model/vuetify'
import { ListSize } from '../../../../../@model/templates/tableFields'
import ImageField from './ImageField.vue'

const props = withDefaults(defineProps<{
  id: string
  imagePath: string
  compressionForPreview?: number
  size?: ListSize
}>(), {
  size: ListSize.MD,
})

const modal = inject('modal')
const SPINNER_HEIGHT = 200

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)
const isImageLoaded = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerHeight = ref(SPINNER_HEIGHT)

const onImageLoad = () => {
  if (imageRef.value) {
    containerHeight.value = Math.max(imageRef.value.offsetHeight, SPINNER_HEIGHT)
  }
  setTimeout(() => {
    isImageLoaded.value = true
  }, 400)
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
      @click.stop="modal.showModal(`${id}-image-detail`)"
    />
    <BaseModal
      :id="`${id}-image-detail`"
      :size="ModalSizes.FullScreen"
    >
      <div class="image-modal-content">
        <div
          ref="containerRef"
          :class="['image-container', { 'image-container--loaded': isImageLoaded }]"
          :style="{ height: `${containerHeight}px` }"
        >
          <div
            v-if="!isImageLoaded"
            class="spinner-wrapper"
          >
            <VProgressCircular
              indeterminate
              :size="VSizes.Large"
            />
          </div>
          <img
            ref="imageRef"
            data-test-id="image-detail"
            :src="imagePath"
            alt="full img"
            class="full-size-img"
            @load="onImageLoad"
          >
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
$transition-duration: 0.4s;

.image-modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 100%;
  transition: height $transition-duration ease-out;
}

.spinner-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fade-in 0.1s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.full-size-img {
  width: fit-content;
  max-width: calc(100% - 8rem);
  max-height: 50vh;
  opacity: 0;
  transition: opacity $transition-duration ease-out;
}

.image-container--loaded {
  .full-size-img {
    opacity: 1;
  }
}
</style>
