<template>
  <div v-b-modal="modalId" class="d-flex justify-content-center align-items-center">
    <image-field :image-path="imagePath" />
    <c-modal v-if="imagePath" :id="modalId" title="" :size="BSize.Xl" hide-footer>
      <div class="d-flex justify-content-center align-items-center">
        <img :src="imagePath" alt="full img" class="full-size-img" />
      </div>
    </c-modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BSize } from '../../../../@model/bootstrap'
import ImageField from '../_components/ImageField.vue'
import CModal from '../../../../components/CModal.vue'

const props = defineProps<{
  id: string
  imagePath: string
}>()

const modalId = computed(() => `full-img-${props.id}`)
</script>

<style lang="scss" scoped>
.full-size-img {
  width: fit-content;
  max-width: calc(100% - 8rem);
  max-height: 80vh;
}
</style>


