<script setup lang="ts">
import { VColors } from '../@model/vuetify'
</script>

<template>
  <div class="grid-container d-flex align-center justify-center">
    <RouterLink
      class="navbar-brand"
      to="/"
    >
      <span class="text-primary text-uppercase text-h5 font-weight-bold">
        {{ $t('title.backoffice') }}
      </span>
    </RouterLink>

    <div class="content-wrapper d-flex align-center justify-center flex-column">
      <p class="text-h3 mb-3">
        {{ $t('page.404.title') }}
      </p>

      <p class="text-body-1 mb-8">
        {{ $t('page.404.description') }}
      </p>

      <VBtn
        to="/"
        :color="VColors.Primary"
      >
        {{ $t('page.404.backToHome') }}
      </VBtn>
    </div>
  </div>
</template>

<style lang="scss">
.grid-container {
  width: 100%;
  height: 100vh;

  .navbar-brand {
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem 2.5rem;
    z-index: 1;
  }

  .content-wrapper {
    background-image: url('../assets/images/error/404.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width: 100%;
    max-width: 60rem;
    height: 100vh;
    max-height: 31.25rem;
  }
}
</style>
