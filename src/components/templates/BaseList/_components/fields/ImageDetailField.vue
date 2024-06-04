<script setup lang="ts">
import { computed, inject } from 'vue'
import BaseModal from '../../../../BaseModal/index.vue'
import ImageField from './ImageField.vue'

const props = defineProps<{
  id: string
  imagePath: string
  compressionForPreview?: number
}>()

const modal = inject('modal')

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)
</script>

<template>
  <div
    v-if="imagePath"
    class="d-flex justify-content-center align-center image-detail-field"
  >
    <ImageField
      :image-path="previewImage"
      @click.stop="modal.showModal(`${id}-image-detail`)"
    />
    <BaseModal
      :id="`${id}-image-detail`"
      width="100%"
    >
      <div class="d-flex justify-center align-center pa-5">
        <img
          :src="imagePath"
          alt="full img"
          class="full-size-img"
        >
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
