<script setup lang="ts">
import { computed } from 'vue'
import ImageField from './ImageField.vue'

const props = defineProps<{
  id: string
  imagePath: string
  compressionForPreview?: number
}>()

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)
</script>

<template>
  <div class="d-flex justify-content-center align-center image-detail-field" v-if="imagePath">
    <ImageField
      :image-path="previewImage"
      @click.stop="$modal.showModal(`${id}-image-detail`)"
    />
    <BaseModal :id="`${id}-image-detail`">
      <div class="d-flex justify-content-center align-center">
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
