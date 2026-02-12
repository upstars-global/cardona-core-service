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

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)
const loadImage = ref(true)

const changeLoadImage = (value: boolean) => {
  loadImage.value = value
}

// TODO: https://upstars.atlassian.net/browse/BAC-7362
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
      <div class="d-flex justify-center align-center pa-5">
        <img
          v-show="!loadImage"
          data-test-id="image-detail"
          :src="imagePath"
          alt="full img"
          class="full-size-img"
          @load="changeLoadImage(false)"
        >
        <div
          v-if="loadImage"
          class="d-flex justify-center align-center"
          style="height: 80vh"
        >
          <VProgressCircular
            indeterminate
            :size="VSizes.Large"
          />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped>
.full-size-img {
  width: fit-content;
  max-width: calc(100% - 8rem);
  max-height: 80vh;
}
</style>
