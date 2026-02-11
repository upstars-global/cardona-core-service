<script setup lang="ts">
import { computed, inject } from 'vue'
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
const [isLoadingFullImage, toggleLoadingFullImage] = useToggle()
</script>

<template>
  <div
    v-if="imagePath"
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
          v-show="!isLoadingFullImage"
          data-test-id="image-detail"
          :src="imagePath"
          alt="full img"
          class="full-size-img"
          @load="toggleLoadingFullImage"
        >
        <div
          v-if="isLoadingFullImage"
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
