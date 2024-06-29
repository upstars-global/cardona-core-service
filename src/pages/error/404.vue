<script setup lang="ts">
import ErrorHeader from '../../components/ErrorHeader.vue'

defineOptions({
  name: 'NotFound',
})
</script>

<template>
  <div class="grid-container">
    <div class="misc-wrapper d-flex align-center justify-center">
      <ErrorHeader
        :status-code="$t('page.404.statusCode')"
        :title="$t('page.404.title')"
        :description="$t('page.404.description')"
      />
    </div>
    <div class="d-flex align-center justify-center my-2">
      <VBtn
        to="/"
        class="mb-12"
      >
        {{ $t('page.404.backToHome') }}
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
@use "../../@core/scss/template/pages/misc.scss";
.grid-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border-radius: 8px;
}
</style>
