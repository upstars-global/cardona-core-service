<script setup lang="ts">
import ctaDashborad from '@images/front-pages/landing-page/cta-dashboard.png'
</script>

<template>
  <div
    class="landing-cta bg-surface"
    :class="$vuetify.theme.current.dark ? 'banner-bg-dark' : 'banner-bg-light'"
  >
    <VContainer>
      <div class="d-flex align-center justify-center justify-md-space-between flex-wrap gap-6 gap-x-10 position-relative pt-10">
        <div class="d-flex justify-start align-center">
          <div>
            <h2 class="text-h2 text-primary font-weight-bold">
              Ready to Get Started?
            </h2>
            <h5 class="text-h5 font-weight-medium mb-8">
              Start your project with a 14-day free trial
            </h5>
            <VBtn
              color="primary"
              :to="{ name: 'front-pages-payment' }"
              height="48"
            >
              Get Started
            </VBtn>
          </div>
        </div>

        <div class="banner-img mb-n5">
          <img
            :src="ctaDashborad"
            class="w-100"
          >
        </div>
      </div>
    </VContainer>
  </div>
</template>

<style lang="scss">
.landing-cta {
  background-size: cover;
  margin-block: auto;
}

.banner-bg-light{
  background-image: url("@images/front-pages/backgrounds/cta-bg.png");
}

.banner-bg-dark{
  background-image: url("@images/front-pages/backgrounds/cta-bg-dark.png");

}
</style>
