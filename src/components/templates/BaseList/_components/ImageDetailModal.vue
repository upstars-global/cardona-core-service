<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '../../../BaseModal/index.vue'
import { ModalSizes, VSizes } from '../../../../@model/vuetify'
import { ModalsId } from '../../../../@model/modalsId'

defineOptions({
  name: 'ImageDetailModal',
})

const SPINNER_HEIGHT = 200

const isImageLoaded = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const containerHeight = ref(SPINNER_HEIGHT)

const onImageLoad = () => {
  if (imageRef.value)
    containerHeight.value = Math.max(imageRef.value.offsetHeight, SPINNER_HEIGHT)

  setTimeout(() => {
    isImageLoaded.value = true
  }, 400)
}

const onHide = () => isImageLoaded.value = false
</script>

<template>
  <BaseModal
    :id="ModalsId.ImageDetailModal"
    :size="ModalSizes.FullScreen"
    @hide="onHide"
  >
    <template #default="{ payload }">
      <div class="image-modal-content">
        <div
          ref="containerRef"
          class="image-container"
          :class="[{ 'image-container--loaded': isImageLoaded }]"
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
            :src="payload?.imagePath"
            alt="full img"
            class="full-size-img"
            @load="onImageLoad"
          >
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
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
