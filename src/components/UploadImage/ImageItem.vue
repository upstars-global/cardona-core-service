<script setup lang="ts">
import { ref } from 'vue'

defineProps<
  {
    file: {
      publicPath: string
      path: string
    }
  }>()

defineEmits<{
  (e: 'click'): void
}>()

const isLoading = ref(false)
const isError = ref(false)

const onError = () => {
  isError.value = true
}

const toggleLoad = (value = true) => {
  isLoading.value = value
}
</script>

<template>
  <div class="image-item d-flex align-center justify-center">
    <VProgressCircular
      v-if="isLoading && !isError"
      indeterminate
    />
    <span
      v-if="isError"
      class="text-center text-body-2 text-error text-wrap"
    >{{ $t('uploadImg.errorLoadImage') }}</span>

    <VImg
      v-show="!isError && !isLoading"
      :src="`${file.publicPath}?ar=184`"
      class="item-file-img"
      @error="onError"
      @loadstart="toggleLoad"
      @load="toggleLoad(false)"
      @click="$emit('click')"
    />
  </div>
</template>

<style lang="scss" scoped>
.image-item {
  background: rgba(var(--v-theme-grey-500), var(--v-activated-opacity));
  height: 100%;
}
</style>
