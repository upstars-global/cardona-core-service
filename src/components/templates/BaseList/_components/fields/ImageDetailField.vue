<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ModalKeys } from '../../../../../@model/enums/modals'
import ImageField from './ImageField.vue'

const props = defineProps<{
  id: string
  imagePath: string
  compressionForPreview?: number
}>()

const store = useStore()
const modalKey = ModalKeys.FullImage

const previewAdditionalParams = computed(() =>
  props.compressionForPreview ? `?ar=${props.compressionForPreview}` : '',
)

const previewImage = computed(() => props.imagePath + previewAdditionalParams.value)

const onShowModal = () => {
  store.dispatch('modalsCore/setModalState', { modalKey, data: props.id })
}

const isOpenModal = computed(() => store.getters['modalsCore/getState'](modalKey) === props.id)
</script>

<template>
  <div class="d-flex justify-content-center align-items-center image-detail-field">
    <ImageField
      :image-path="previewImage"
      @click.stop="onShowModal"
    />

    <BaseModal
      :modal-key="modalKey"
      :state="isOpenModal"
    >
      <template #modal-body>
        <div class="d-flex justify-content-center align-items-center">
          <img
            :src="imagePath"
            alt="full img"
            class="full-size-img"
          >
        </div>
      </template>
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
