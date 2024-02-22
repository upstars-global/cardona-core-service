<script setup lang="ts">
import ErrorHeader from '../components/ErrorHeader.vue'
</script>

<template>
  <div class="misc-wrapper d-flex align-center justify-center">
    <ErrorHeader
      :status-code="$t('page.404.statusCode')"
      :title="$t('page.404.title')"
      :description="$t('page.404.description')"
    />
    <div class="d-flex align-center justify-center">
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
@use "../@core/scss/template/pages/misc.scss";
</style>
